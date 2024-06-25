return {
	"nvim-neo-tree/neo-tree.nvim",
	branch = "v3.x",
	dependencies = {
		"nvim-lua/plenary.nvim",
		"nvim-tree/nvim-web-devicons",
		"MunifTanjim/nui.nvim",
	},
	config = function()
		require("neo-tree").setup({
			window = {
				width = 25,
				mappings = {
					["l"] = "open",
					["h"] = "close_node",
				},
			},
			filesystem = {
				use_libuv_file_watcher = true,
				follow_current_file = {
					enabled = true,
				},
			},
		})

		-- Refresh file-tree after closing lazygit
		vim.api.nvim_create_autocmd({ "BufLeave" }, {
			pattern = { "*lazygit*" },
			callback = function()
				require("neo-tree.sources.filesystem.commands").refresh(
					require("neo-tree.sources.manager").get_state("filesystem")
				)
			end,
		})
	end,
}
