vim.cmd("set tabstop=4")
vim.cmd("set softtabstop=4")
vim.cmd("set noexpandtab")
vim.cmd("set shiftwidth=4")
vim.cmd("set number")
vim.cmd("set termguicolors")
vim.cmd("set notimeout")
vim.cmd("set hidden")
vim.cmd("set clipboard=unnamedplus")
vim.cmd("set noshowcmd")
vim.cmd("set list")
vim.cmd("set listchars=tab:\\▏\\ →\\,space:·")
vim.cmd("set nospell spelllang=en_us,en_gb,cs")

-- Set cursor back to beam when leaving Neovim.
vim.api.nvim_create_autocmd("ExitPre", {
	command = "set guicursor=a:ver90-blinkon1",
})
