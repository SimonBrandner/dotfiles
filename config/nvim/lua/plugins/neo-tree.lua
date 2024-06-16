return {
	"nvim-neo-tree/neo-tree.nvim",
	branch = "v3.x",
	dependencies = {
		"nvim-lua/plenary.nvim",
		"nvim-tree/nvim-web-devicons",
		"MunifTanjim/nui.nvim",
	},
	config = function ()
		require("neo-tree").setup({
			window = {
				width = 25,
				mappings = {
					["l"] = "open",
					["h"] = "close_node"
				}
			},
			filesystem = {
				use_libuv_file_watcher = true
			}
		})
	end
}
