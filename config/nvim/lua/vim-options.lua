vim.cmd("set tabstop=4")
vim.cmd("set softtabstop=0")
vim.cmd("set noexpandtab")
vim.cmd("set shiftwidth=4")
vim.cmd("set number")
vim.cmd("set termguicolors")
vim.cmd("set notimeout")
vim.cmd("set nohidden")

vim.api.nvim_create_autocmd("ExitPre", {
	group = vim.api.nvim_create_augroup("Exit", { clear = true }),
	command = "set guicursor=a:ver90-blinkon1",
	desc = "Set cursor back to beam when leaving Neovim."
})
