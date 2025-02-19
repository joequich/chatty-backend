#### API

Commands to run docker images of postgresql and pgadmin in localhost

create network for container
```
docker network create postgres-net
```

pull images

```
docker pull postgres:17.3
docker pull dpage/pgadmin4:9.0
```

run postgres image

```
docker run -p 5432:5432 -d \
-e POSTGRES_PASSWORD=lechedevaca \
-e POSTGRES_USER=admin \
-e POSTGRES_DB=postgresdb \
--name postgresdb \
--net postgres-net \
postgres:17.3
```


run pdgadmin image

```
docker run -p 8080:80 -d \
-e PGADMIN_DEFAULT_EMAIL=admin@admin.com \
-e PGADMIN_DEFAULT_PASSWORD=admin \
--net postgres-net \
--name pgadmin \
dpage/pgadmin4:9.0
```
