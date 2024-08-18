return {
	"nvim-treesitter/nvim-treesitter-context",
	config = function()
		require("treesitter-context").setup({
			enable = true,
			line_numbers = true,
			mode = "topline",
			separator = "―",
		})

		vim.api.nvim_create_autocmd("VimEnter", {
			callback = function()
				-- This needs to be deffered for some reason
				vim.defer_fn(function()
					vim.cmd("TSContextEnable")
				end, 50)
			end,
		})
	end,
}
