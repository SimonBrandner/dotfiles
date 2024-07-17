return {
	"direnv/direnv.vim",
	config = function()
		vim.api.nvim_create_autocmd("User", {
			pattern = "DirenvLoaded",
			callback = function()
				vim.cmd("LspStop")
				-- We need some delay for some reason
				vim.fn.timer_start(1000, function()
					vim.cmd("LspStart")
				end)
			end,
		})
	end,
}
