dev-setup:

	$(shell (cd devops/development; find . -type f -name "*.example" -exec sh -c 'cp -n {} $$(basename {} .example)' \;))

	$(shell sudo docker network create sisgea-net 2>/dev/null)

dev-up:
	make dev-setup;
	sudo docker compose --file devops/development/docker-compose.yml -p sisgea-module-busca up -d --remove-orphans;

dev-shell:
	make dev-up;
	sudo docker compose --file devops/development/docker-compose.yml -p sisgea-module-busca exec sisgea-module-busca bash;

dev-down:
	sudo docker compose --file devops/development/docker-compose.yml -p sisgea-module-busca stop

dev-logs:
	sudo docker compose --file devops/development/docker-compose.yml -p sisgea-module-busca logs -f
