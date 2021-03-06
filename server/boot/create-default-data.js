'use strict';

var async = require('async');
module.exports = function(app) {
  // data sources
  var mongoDs = app.dataSources.mongoDs; // 'name' of your mongo connector, you can find it in datasource.json
  var Role = app.models.Role;
  var RoleMapping = app.models.RoleMapping;
  // create all models
  async.parallel({
    users: async.apply(createUsers),
    servers: async.apply(createServers),
  }, function(err, results) {
    if (err) throw err;
    console.log('> models created sucessfully');
  });

  // create users
  function createUsers(cb) {
    var User = app.models.User;
    var emailAdmin = 'root@xeen.com';
    var emailUser = 'user@xeen.com';
    User.findOne({email: emailAdmin}, function(err, user) {
      console.log('Log user', user);
      if (err) {
        cb(err);
        console.error(err);
        return;
      }
      if (!user) {
        console.log('USer: ', user);
        User.create([{
          email: emailAdmin,
          password: '123456',
          username: 'zeeworker',
          realm: 'admin',
        },
        {
          email: emailUser,
          password: '123456',
          username: 'normaluser',
        }], function(err, users) {
          if (err) return cb(err);
          Role.findOne({name: 'admin'}, function(err, role) {
            if (err) return cb(err);
            if (!role) {
              Role.create({
                name: 'admin',
              }, function(err, role) {
                if (err) throw err;
                console.log('Created role:', role);
                role.principals.create({
                  principalType: RoleMapping.USER,
                  principalId: users[0].id,
                }, function(err, principal) {
                  if (err) throw err;
                  console.log('Created principal:', principal);
                });
              });
            } else {
              console.log('Role already exists');
            }
          });
        });
      } else {
        console.log('User', user);
      }
    });
  }

  // create servers
  function createServers(cb) {
    mongoDs.automigrate('Server', function(err) {
      if (err) return cb(err);
      var Server = app.models.Server;
      Server.create([{
        username: 'root',
        password: 'K%6s6Cz[1dPG1X5V',
        serverName: 'Best Server',
        serverCountry: 'NG',
        serverIp: '78.141.206.96',
        config: 'client\ndev tun\nproto udp\nsndbuf 0\nrcvbuf 0\nremote 78.141.206.96 1194\nresolv-retry infinite\nnobind\npersist-key\npersist-tun\nremote-cert-tls server\nauth SHA512\ncipher AES-256-CBC\ncomp-lzo\nsetenv opt block-outside-dns\nkey-direction 1\nverb 3\n<ca>\n-----BEGIN CERTIFICATE-----\nMIIDQjCCAiqgAwIBAgIUFmDx7wGVOu4+wO0HQiLw1dOpogEwDQYJKoZIhvcNAQEL\nBQAwEzERMA8GA1UEAwwIQ2hhbmdlTWUwHhcNMjAwMTI0MTYwMDU0WhcNMzAwMTIx\nMTYwMDU0WjATMREwDwYDVQQDDAhDaGFuZ2VNZTCCASIwDQYJKoZIhvcNAQEBBQAD\nggEPADCCAQoCggEBANYRuyf3/eNu/fnbz/mXvyoJWer9kBVVdMcyueYq33fxksuh\nIRYhUfoFOXgPMnhPDEE64ryxPqo+5Qbz4OXGIZ/+bMQdi5PilmuOGMfI5zlSBEjM\nrZkB88oYdmozXrYVQUKfOQQbAUYxGE0L8GOVjlo5PEgkqO7quh4a269wsFKy+dKW\nrHwl2KsvrWVxYxsxbM7veMzYPZ3eEfSwr+kazTj2I+j9WhBZUZpG1JCgbKD2peTp\nzS85X3SE0CdbtGwOZfkLxRFLS3fIfEPWOF5s+8HakWeJqPU7iKf7QRNaQJBYlgB9\nrprwyoFExjPIUATuvtQO96FEsUZO8iZ2aE9Y7LcCAwEAAaOBjTCBijAdBgNVHQ4E\nFgQU5/67LPugDpH+kOrStIksG2VKXYgwTgYDVR0jBEcwRYAU5/67LPugDpH+kOrS\ntIksG2VKXYihF6QVMBMxETAPBgNVBAMMCENoYW5nZU1lghQWYPHvAZU67j7A7QdC\nIvDV06miATAMBgNVHRMEBTADAQH/MAsGA1UdDwQEAwIBBjANBgkqhkiG9w0BAQsF\nAAOCAQEASRAc7gM+JIcfzqAKV/YxyPpxR0UdZS//YXU0NfdnG4I9DQZMebL3E637\nytu2FpA/Vjq8cgf/cY/bar5NVY8IpWN9LV0nM3kU3C6I30NkVvG/+SUEsrooOz/l\nOeESZb3SqxZ5v65Y0fAwhntTMyyqDoj5Cp4lLDFECBTzDeY/DAqjaOMCnjt0BzpO\n2sKj57P35UTi2Vw1HqvMDKe0q4+aOZpEh2rnk1XL9xQNZ34e8PWsEQtRFlQnThMk\n5PV2CkY8fgOBNnhkPVR96InVR0yxg/dkbuBUgP4yx67Lfw9NH/dbEJaHqBnsapb8\nJz8GlvM+tPsvZPNgyhHOcfuOvhlwzA==\n-----END CERTIFICATE-----\n</ca>\n<cert>\nCertificate:\n    Data:\n        Version: 3 (0x2)\n        Serial Number:\n            67:57:93:05:04:3e:fa:3c:0e:7c:74:de:73:54:a2:18\n        Signature Algorithm: sha256WithRSAEncryption\n        Issuer: CN=ChangeMe\n        Validity\n            Not Before: Jan 24 16:01:08 2020 GMT\n            Not After : Jan 21 16:01:08 2030 GMT\n        Subject: CN=client\n        Subject Public Key Info:\n            Public Key Algorithm: rsaEncryption\n                RSA Public-Key: (2048 bit)\n                Modulus:\n                    00:c0:f7:9c:26:96:99:cf:8d:16:8c:15:27:31:a1:\n                    68:05:20:0a:25:4a:3c:a9:76:03:53:6b:d3:06:aa:\n                    f6:19:db:ef:02:2e:06:72:0f:a3:a8:88:80:14:71:\n                    f5:c0:aa:ba:0a:78:66:34:09:87:48:9f:38:05:3d:\n                    fb:ef:73:10:d1:3d:c3:35:b6:b5:2c:ec:87:14:fc:\n                    2f:cf:0d:fa:8e:30:76:9c:12:ef:a9:6a:ee:31:ce:\n                    c2:57:94:6f:3d:78:90:e6:b2:bb:17:2f:f0:fa:df:\n                    b9:42:8e:a3:ee:65:e0:e0:f1:62:b9:4f:a3:33:7b:\n                    97:a4:4f:69:52:5b:be:de:10:5a:08:32:90:5e:9c:\n                    3e:d4:7d:f3:f2:cc:5e:0d:97:14:72:7f:57:43:08:\n                    6e:77:0a:a4:9c:0f:f9:ee:49:a8:dc:b7:ab:d8:36:\n                    04:34:b9:be:56:22:4b:2e:5d:15:13:1d:97:2a:d6:\n                    c4:9f:9b:24:6a:0f:06:62:fc:89:9a:f5:e7:e7:82:\n                    a0:18:5d:39:35:5b:8b:a5:0e:bd:60:d7:18:8d:2a:\n                    a7:20:d7:cf:6f:6b:33:65:cc:80:c6:04:b9:af:9c:\n                    1f:26:07:85:82:b6:96:e5:79:ab:76:f8:0f:0a:a0:\n                    b9:9d:a2:60:19:c3:5c:77:62:bc:63:3a:a2:5d:b6:\n                    0c:0d\n                Exponent: 65537 (0x10001)\n        X509v3 extensions:\n            X509v3 Basic Constraints: \n                CA:FALSE\n            X509v3 Subject Key Identifier: \n                D7:B6:94:67:99:54:06:81:3F:36:B0:88:98:76:26:8E:F4:A0:E9:D6\n            X509v3 Authority Key Identifier: \n                keyid:E7:FE:BB:2C:FB:A0:0E:91:FE:90:EA:D2:B4:89:2C:1B:65:4A:5D:88\n                DirName:/CN=ChangeMe\n                serial:16:60:F1:EF:01:95:3A:EE:3E:C0:ED:07:42:22:F0:D5:D3:A9:A2:01\n\n            X509v3 Extended Key Usage: \n                TLS Web Client Authentication\n            X509v3 Key Usage: \n                Digital Signature\n    Signature Algorithm: sha256WithRSAEncryption\n         68:87:14:6c:5b:d8:dc:a2:39:c4:ff:c2:e4:e3:02:fe:32:bd:\n         07:6c:e5:62:bf:07:9e:33:3d:4f:d1:ad:b9:83:fa:80:70:0f:\n         a8:84:ae:2a:b9:9e:e5:5a:11:36:86:69:05:41:73:62:81:c7:\n         2c:31:49:57:30:fb:54:c2:dc:62:c9:77:b2:b7:b3:b8:af:ec:\n         b9:14:2f:9d:59:5c:9c:5c:11:b4:3e:ba:01:98:de:3a:c5:f4:\n         23:89:d4:c2:88:33:a3:81:b3:c7:d0:6f:8a:92:21:2d:fc:40:\n         fd:9b:af:c3:88:9e:74:37:e5:1f:31:b7:01:d4:65:b4:54:f9:\n         bc:8e:52:e1:77:e2:64:8b:11:70:db:85:91:08:1d:fb:17:ba:\n         08:6a:57:47:64:5f:81:0c:e7:26:c8:c5:bd:75:57:ed:f3:24:\n         3a:e0:e1:68:5f:e1:13:33:d5:f7:1f:b8:67:49:b2:ca:d6:4b:\n         67:9a:89:43:06:89:f2:1e:09:78:9a:0a:d0:f1:4f:83:fb:8e:\n         c7:42:3f:fa:75:b9:12:a1:a7:09:d7:46:83:b0:39:03:46:0c:\n         f5:1f:d8:d7:38:8e:7d:9f:d2:4b:fb:42:6e:c6:63:dd:1e:bb:\n         c6:bf:c0:d6:8c:49:07:a5:5d:82:6a:3c:b6:c8:13:5b:49:90:\n         0e:dc:c7:c4\n-----BEGIN CERTIFICATE-----\nMIIDTjCCAjagAwIBAgIQZ1eTBQQ++jwOfHTec1SiGDANBgkqhkiG9w0BAQsFADAT\nMREwDwYDVQQDDAhDaGFuZ2VNZTAeFw0yMDAxMjQxNjAxMDhaFw0zMDAxMjExNjAx\nMDhaMBExDzANBgNVBAMMBmNsaWVudDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCC\nAQoCggEBAMD3nCaWmc+NFowVJzGhaAUgCiVKPKl2A1Nr0waq9hnb7wIuBnIPo6iI\ngBRx9cCqugp4ZjQJh0ifOAU9++9zENE9wzW2tSzshxT8L88N+o4wdpwS76lq7jHO\nwleUbz14kOayuxcv8PrfuUKOo+5l4ODxYrlPozN7l6RPaVJbvt4QWggykF6cPtR9\n8/LMXg2XFHJ/V0MIbncKpJwP+e5JqNy3q9g2BDS5vlYiSy5dFRMdlyrWxJ+bJGoP\nBmL8iZr15+eCoBhdOTVbi6UOvWDXGI0qpyDXz29rM2XMgMYEua+cHyYHhYK2luV5\nq3b4DwqguZ2iYBnDXHdivGM6ol22DA0CAwEAAaOBnzCBnDAJBgNVHRMEAjAAMB0G\nA1UdDgQWBBTXtpRnmVQGgT82sIiYdiaO9KDp1jBOBgNVHSMERzBFgBTn/rss+6AO\nkf6Q6tK0iSwbZUpdiKEXpBUwEzERMA8GA1UEAwwIQ2hhbmdlTWWCFBZg8e8BlTru\nPsDtB0Ii8NXTqaIBMBMGA1UdJQQMMAoGCCsGAQUFBwMCMAsGA1UdDwQEAwIHgDAN\nBgkqhkiG9w0BAQsFAAOCAQEAaIcUbFvY3KI5xP/C5OMC/jK9B2zlYr8HnjM9T9Gt\nuYP6gHAPqISuKrme5VoRNoZpBUFzYoHHLDFJVzD7VMLcYsl3srezuK/suRQvnVlc\nnFwRtD66AZjeOsX0I4nUwogzo4Gzx9BvipIhLfxA/Zuvw4iedDflHzG3AdRltFT5\nvI5S4XfiZIsRcNuFkQgd+xe6CGpXR2RfgQznJsjFvXVX7fMkOuDhaF/hEzPV9x+4\nZ0myytZLZ5qJQwaJ8h4JeJoK0PFPg/uOx0I/+nW5EqGnCddGg7A5A0YM9R/Y1ziO\nfZ/SS/tCbsZj3R67xr/A1oxJB6Vdgmo8tsgTW0mQDtzHxA==\n-----END CERTIFICATE-----\n</cert>\n<key>\n-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDA95wmlpnPjRaM\nFScxoWgFIAolSjypdgNTa9MGqvYZ2+8CLgZyD6OoiIAUcfXAqroKeGY0CYdInzgF\nPfvvcxDRPcM1trUs7IcU/C/PDfqOMHacEu+pau4xzsJXlG89eJDmsrsXL/D637lC\njqPuZeDg8WK5T6Mze5ekT2lSW77eEFoIMpBenD7UffPyzF4NlxRyf1dDCG53CqSc\nD/nuSajct6vYNgQ0ub5WIksuXRUTHZcq1sSfmyRqDwZi/Ima9efngqAYXTk1W4ul\nDr1g1xiNKqcg189vazNlzIDGBLmvnB8mB4WCtpbleat2+A8KoLmdomAZw1x3Yrxj\nOqJdtgwNAgMBAAECggEAOp695AcaILAGqnV+m5gh5nSuQFfGB+De78ewqrTi4EYs\n3Geo85uGpxsYdZ2M/4Od0rJysdo3K7uapBUJZNt6v2XY2IdxkH0mKBzYVTk05V8Z\nmR4zii7+v0jFRx/Dj1QCCONA7LFWro+qUurMKA7w+sS5rfvgYzJnhbXOFAPk/sZG\n4t4RfPrw6VmcEH85DLrXrTwA+eBl83xk0cxG1/kfISGnNla+zJG7GR0A87BfsIfA\nfunJrL+ODunPhOOf2rldZb70Sf/G/cDMrTeACxyxjIMRnGxEODC6M8dPqHVRVRZC\nb3aIM+W6749uu3jiYexrKgSGIJOP+oxh7Fu2VFhfLQKBgQD6boQAQdk0VN7lnRbh\n4CncbB3RmMu0hXziSXz7hHlBjr+evQmRA7V4vTVK/2c+n29PsWannL6+SP1rz7he\nv334liHu1j7roPVHwks73kJ9AnbfXNg7oCJI63XJ/0pcIxzxFZmVrYR7v9qgwAi7\nrpYg40dU2nENeiDrfpj2e+3nqwKBgQDFQgAUz78sB5541ybdRct9//tEwbzdExJJ\nqzGbq251f0ImfSs6BLzv6Qhwn0ZxXAqJ5JJFVBxipr9a8T9MHiZfLC+2wycSmo+3\nKX7+EAO8MyQIlDsG3+YRSozHQ4u69e3OzJAKui5NVHkRIdhtLpA74kkKSBudO1vp\npigfvIJDJwKBgQCjW3/joxCKYGpdoVER2mW0ERqKZH9MrF7ARWuvrcRjDTjV1T3u\nSFsR/WpMF7pDUUEM3Q23fDm4amhU8VS1CXiktVpBL6Qvk/kr7AOjc+IvJXJhVXD/\nw/9ZTa6yK0NYQtdYM9zRlDR9fLKidWG8+6+WmGspYKyqO+ZJd3VUI5cWrQKBgGQo\n0BvBJOP5dmkLbit6rgnrea1+5iQm8+k+KPFPScYVeQRMGC/cigcTf3qYFU+oGZ3M\n1synGcapvo4x4x8GTBuVNyEI1IUowAKT6mycuxjLqudERPiHpa1v+i2PyZqEF10j\nF5yqzqnrU5H0ao190DToAIhc9tCOfGwWN1duA4KPAoGBAKtmq3HckeHT7XfyunzJ\nt+0XA2HW9R3OB/G8A0/F2Up3Vw/uFcqJkBmlJJlj+hXhABLEMIAVXOirODInjsVb\nEcz1XrwcQNpLzR1FJCjWYsEw6DeZDmnkdLiFVaM4h3/GGhDRd3QmgBn32wNt0sXG\ngP2//WWH4bJBiCDKq7SSKdZm\n-----END PRIVATE KEY-----\n</key>\n<tls-auth>\n#\n# 2048 bit OpenVPN static key\n#\n-----BEGIN OpenVPN Static key V1-----\n6547705c3b0960e4bc229db75652d931\n3c2ef50ccbd472e3f553ae8894837e43\ne2c0d357d2ffb8ccebec55d65b3937ca\n00e74fd6b0fa5cc02b492a9ed3067a85\n9c4918e2a35a7138cf42bf4e9cb34dc2\n02ea4e79cdec2fd977c28ffe46d8edcb\n9a232d97b39ea778d690f3f4c00f7516\ndfe2467fcfd57396a0a50e65d68a5acd\nd538e20f483b6d1fccf2ba1e7e6eca38\n468a4769970db11795aab534310b7053\n8e9eaa04e86f6f91362ac336a33f5434\n49ea1a8f981fe271e27779941fc708e1\ne231bc0712fbcc2583ab63165cb52d2b\n6a0c2a2aa7bab2971d71ddec7e5c9fc2\nbbfdf9c4c75787af73171f64fb623bf1\ne0e381bc0c1cfd981e1e9941509b3218\n-----END OpenVPN Static key V1-----\n</tls-auth>\n',
        dateCreated: Date.now(),
        dateUpdated: Date.now(),
      }], cb);
    });
  }
};
