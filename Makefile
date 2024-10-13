run-app:
	npm install
	cp .env.example .env
	docker-compose up --build -d