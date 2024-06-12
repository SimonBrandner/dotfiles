return {
	'akinsho/toggleterm.nvim',
	version = "*",
	config = function ()
		require("toggleterm").setup({
			direction = "horizontal"
		})
	end
}
