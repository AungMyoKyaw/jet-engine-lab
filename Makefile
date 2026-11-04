SHELL := /bin/sh

BUN ?= bun

.PHONY: help install dev build preview typecheck test check \
	smoke smoke-visual smoke-production smoke-all smoke-studio smoke-engines \
	smoke-cad smoke-cad-full docs-check deploy record previews-engines \
	cad-generate

help: ## Show available commands
	@awk 'BEGIN {FS = ":.*##"; print "Usage: make <target>\n"} /^[a-zA-Z0-9_-]+:.*##/ {printf "  %-20s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install locked dependencies
	$(BUN) install --frozen-lockfile

dev: ## Start the Vite development server
	$(BUN) run dev

build: ## Create a production build
	$(BUN) run build

preview: ## Preview the production build locally
	$(BUN) run preview

typecheck: ## Run the TypeScript compiler without emitting files
	$(BUN) run typecheck

test: ## Run the unit test suite
	$(BUN) run test

docs-check: ## Validate project documentation
	$(BUN) run docs:check

check: docs-check typecheck test ## Run documentation, type, and unit checks

smoke: ## Run the standard browser smoke tests
	$(BUN) run smoke

smoke-visual: ## Run visual/responsive browser smoke tests
	$(BUN) run smoke:visual

smoke-production: ## Test the production build and offline shell
	$(BUN) run smoke:production

smoke-all: ## Run production smoke tests in all browsers
	$(BUN) run smoke:all

smoke-studio: ## Run studio workspace smoke tests
	$(BUN) run smoke:studio

smoke-engines: ## Run engine gallery smoke tests
	$(BUN) run smoke:engines

smoke-cad: ## Run focused SolidCraft CAD smoke tests
	$(BUN) run smoke:cad

smoke-cad-full: ## Run full SolidCraft CAD smoke tests
	$(BUN) run smoke:cad:full

cad-generate: ## Generate SolidCraft CAD assets
	$(BUN) run cad:generate

previews-engines: ## Recapture the five engine gallery previews
	$(BUN) run previews:engines

record: ## Record the website walkthrough
	$(BUN) run record

deploy: ## Build and deploy to GitHub Pages
	$(BUN) run deploy
