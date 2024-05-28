# starter

## postgres
1. 安装并初始化数据库
```bash
brew install postgresql
```
```bash
initdb /usr/local/var/postgres
```
2. 启动数据库
```bash
brew services start postgresql
```
3. 创建postgres用户
```bash
psql postgres
CREATE ROLE postgres WITH LOGIN SUPERUSER;
```

4. 切换到 postgres 用户
```bash
psql -U postgres -d postgres
```
5. 设置密码
```bash
ALTER USER postgres WITH PASSWORD 'postgres';
```
6. 生成Prisma 客户端
```bash
npx prisma generate
```

7. 模型同步到数据库
```bash
npx prisma migrate dev --name init
```

## minio
1. 安装minio
```bash
brew install minio/stable/minio
```

2. 安装客户端命令行
```bash
brew install minio/stable/mc
```

3. mc 命令来配置访问MinIO服务器的别名
```bash
mc alias set myminio http://127.0.0.1:9000 minioadmin minioadmin
```

4. 创建存储空间
```bash
mc mb myminio/mybucket
```

3. 启动服务器并制定存储地址
```bash
minio server /Users/junjieding/minio/storage
```

## 启动
```bash
npm run dev
```


## Templates

| Azurill                                                      | Bronzor                                                     | Chikorita                                                   |
| ------------------------------------------------------------ | ----------------------------------------------------------- | ----------------------------------------------------------- |
| <img src="https://i.imgur.com/jKgo04C.jpeg" width="200px" /> | <img src="https://i.imgur.com/DFNQZP2.jpg" width="200px" /> | <img src="https://i.imgur.com/Dwv8Y7f.jpg" width="200px" /> |

| Ditto                                                       | Kakuna                                                      | Nosepass                                                    |
| ----------------------------------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------- |
| <img src="https://i.imgur.com/6c5lASL.jpg" width="200px" /> | <img src="https://i.imgur.com/268ML3t.jpg" width="200px" /> | <img src="https://i.imgur.com/npRLsPS.jpg" width="200px" /> |

| Onyx                                                        | Pikachu                                                     | Rhyhorn                                                     |
| ----------------------------------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------- |
| <img src="https://i.imgur.com/cxplXOW.jpg" width="200px" /> | <img src="https://i.imgur.com/Y9f7qsh.jpg" width="200px" /> | <img src="https://i.imgur.com/h4kQxy2.jpg" width="200px" /> |

## Features
