return {
	{ "hrsh7th/cmp-nvim-lsp" },
	{ "hrsh7th/nvim-cmp" },
	{ "hrsh7th/cmp-path" },
	{ "onsails/lspkind-nvim" },
	{ "L3MON4D3/LuaSnip" },
	{
		"neovim/nvim-lspconfig",
		dependencies = {

			{
				"SmiteshP/nvim-navbuddy",
				dependencies = {
					"SmiteshP/nvim-navic",
					"MunifTanjim/nui.nvim",
				},
				opts = {
					lsp = { auto_attach = true },
					window = {
						size = "95%",
						sections = {
							left = {
								size = "20%",
							},
							mid = {
								size = "20%",
							},
							right = {
								preview = "always",
							},
						},
					},
				},
			},
		},
	},
	{
		"VonHeikemen/lsp-zero.nvim",
		branch = "v3.x",
		config = function()
			local lsp_zero = require("lsp-zero")
			local cmp = require("cmp")
			local lspkind = require("lspkind")

			lsp_zero.extend_lspconfig()
			lsp_zero.set_preferences({
				call_servers = "global",
			})

			lsp_zero.configure("lua_ls", {
				settings = {
					Lua = {
						diagnostics = { globals = { "vim" } },
						runtime = { version = "LuaJIT" },
						telemetry = { enable = false },
					},
				},
			})
			lsp_zero.configure("rust_analyzer", {
				settings = {
					["rust-analyzer"] = {
						checkOnSave = {
							command = "clippy",
						},
					},
				},
			})

			lsp_zero.setup_servers({
				"lua_ls",
				"rust_analyzer",
				"nil_ls",
				"pyright",
				"tsserver",
				"cssls",
				"marksman",
				"texlab",
				"clangd",
				"jdtls",
			})
			lsp_zero.setup()

			lspkind.init({})

			cmp.setup({
				sources = {
					{
						name = "path",
					},
					{
						name = "nvim_lsp",
					},
				},
				preselect = "item",
				completion = {
					completeopt = "menu, menuone, noinsert",
				},
				window = {
					completion = cmp.config.window.bordered(),
					documentation = cmp.config.window.bordered(),
				},
				formatting = {
					fields = { "abbr", "kind", "menu" },
					format = require("lspkind").cmp_format({
						mode = "symbol",
						maxwidth = 50,
						ellipsis_char = "...",
						show_labelDetails = false,
						menu = {},
					}),
				},
				view = {
					entries = { name = "custom", selection_order = "near_cursor" },
				},
				mapping = {
					["<CR>"] = cmp.mapping.confirm({}),
					["<Tab>"] = cmp.mapping.select_next_item({ behavior = "select" }),
					["<S-Tab>"] = cmp.mapping.select_prev_item({ behavior = "select" }),
					["<Esc>"] = cmp.mapping.abort(),
				},
			})
		end,
	},
}
