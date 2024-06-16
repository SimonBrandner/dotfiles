return {
    "NStefan002/screenkey.nvim",
    lazy = false,
    version = "*",
	config = function ()
		require("screenkey").setup({
			win_opts = {
				width = 16,
			},
			show_leader = false,
			group_mappings = true,
		})
	end
}
