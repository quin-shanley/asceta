build: ## Run esbuild to bundle the project
	pnpx esbuild build.google_sheets.js --bundle --format=iife --target=es2020 --outdir=dist
