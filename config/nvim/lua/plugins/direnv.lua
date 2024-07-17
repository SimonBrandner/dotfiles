return {
	"direnv/direnv.vim",
	config = function()
		-- This can be reenabled once https://github.com/neovim/neovim/issues/28987 gets into release
		-- vim.api.nvim_create_autocmd("User", {
		-- 	pattern = "DirenvLoaded",
		-- 	callback = function()
		-- 		vim.cmd("LspRestart")
		-- 	end,
		-- })
	end,
}
