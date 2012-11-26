install:
	./node_modules/.bin/bower install; \
	./node_modules/.bin/component install; \
	mkdir -p ./app/build/TermKit.app/Contents/Resources/HTML; \
	mkdir -p ./app/build/TermKit.app/Contents/Resources/shared

app:
	rm -rf ./app/build/TermKit.app/Contents/Resources/HTML/*; \
	rm -rf ./app/build/TermKit.app/Contents/Resources/shared/*; \
	cp -r ./src/public/* ./app/build/TermKit.app/Contents/Resources/HTML/; \
	cp -r ./src/shared/* ./app/build/TermKit.app/Contents/Resources/shared/; \
	cp -r ./app/build/TermKit.app /Applications/

clean:
	rm -rf components; \
	rm -rf node_modules; \
	rm -rf src/public/build; \
	rm -rf src/public/vendor

build:
	./node_modules/.bin/component build -v -o src/public/build

start:
	open app/build/TermKit.app & node src/nodekit.js

.PHONY: install app build start clean