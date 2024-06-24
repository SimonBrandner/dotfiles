return {
	{
		"nvim-telescope/telescope-ui-select.nvim",
		dependencies = { "nvim-telescope/telescope.nvim" },
	},
	{
		"nvim-telescope/telescope.nvim",
		tag = "0.1.6",
		dependencies = { "nvim-lua/plenary.nvim", "scottmckendry/telescope-resession.nvim" },
		config = function()
			local telescope = require("telescope")

			telescope.load_extension("ui-select")
			telescope.setup({
				extensions = {
					["ui-select"] = {
						require("telescope.themes").get_dropdown({}),
					},
					resession = {
						prompt_title = "Find Sessions",
						dir = "session",
						path_substitutions = {
							{ find = "/home/simon", replace = "🏠" },
						},
					},
				},
				defaults = {
					layout_strategy = "horizontal",
					layout_config = {
						horizontal = {
							width = 0.95,
							preview_width = 0.6,
						},
					},
				},
			})

			vim.api.nvim_create_autocmd("User", {
				pattern = "TelescopePreviewerLoaded",
				callback = function()
					vim.wo.wrap = true
				end,
			})
		end,
	},
}
