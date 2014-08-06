all:

install:
	sudo npm install
	node app reset
start:
	rm -rf public/style.css
	node app
