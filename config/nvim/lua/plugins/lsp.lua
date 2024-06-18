return {
	{'onsails/lspkind-nvim'},
	{'hrsh7th/nvim-cmp'},
	{'hrsh7th/cmp-nvim-lsp'},
	{'hrsh7th/nvim-cmp'},
	{'neovim/nvim-lspconfig'},
	{'hrsh7th/cmp-nvim-lsp'},
	{'L3MON4D3/LuaSnip'},
	{
		"nvimtools/none-ls.nvim",
		config = function()
			local cspell = require('cspell')
			local null_ls = require("null-ls")

			null_ls.setup({
				sources = {
					cspell.diagnostics,
					cspell.code_actions,
				}
			})
		end,
		requires = { "nvim-lua/plenary.nvim" },
	},
	{
		'davidmh/cspell.nvim',
		dependencies = { "Joakker/lua-json5" },
	},
	{
		'VonHeikemen/lsp-zero.nvim',
		branch = 'v3.x',
		config = function()
			local lsp_zero = require("lsp-zero")
			local cmp = require("cmp")
			local lspkind = require("lspkind")

			lsp_zero.extend_lspconfig()
			lsp_zero.set_preferences({
				call_servers = "global",
			})
			lsp_zero.configure('lua_ls', {
				settings = {
					Lua = {
						diagnostics = {globals = {'vim'}},
						runtime = {version = 'LuaJIT'},
						telemetry = {enable = false},
					},
				},
			})
			lsp_zero.setup_servers({"lua_ls", "rust_analyzer"})
			lsp_zero.setup()

			lspkind.init({})

			cmp.setup({
				preselect = 'item',
				completion = {
					completeopt = 'menu, menuone, noinsert'
				},
				window = {
					completion = cmp.config.window.bordered(),
					documentation = cmp.config.window.bordered(),
				},
				formatting = {
					fields = {'abbr', 'kind', 'menu'},
					format = require("lspkind").cmp_format({
						mode = 'symbol',
						maxwidth = 50,
						ellipsis_char = '...',
						show_labelDetails = false,
						menu = {}
					})
				},
				view = {
					entries = {name = 'custom', selection_order = 'near_cursor' }
				},
				mapping = {
					["<CR>"] = cmp.mapping.confirm({}),
					["<Tab>"] = cmp.mapping.select_next_item({behavior = 'select'}),
					['<S-Tab>'] = cmp.mapping.select_prev_item({behavior = 'select'}),
					["<Esc>"] = cmp.mapping.abort(),
				}
			})
		end
	}
}
