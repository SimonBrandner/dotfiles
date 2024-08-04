return {
	"RRethy/vim-illuminate",
	config = function()
		vim.cmd("highlight IlluminatedWordRead gui=none cterm=none ctermbg=none guibg=#404040")
		vim.cmd("highlight IlluminatedWordWrite gui=none cterm=none ctermbg=none guibg=#404040")
		vim.cmd("highlight IlluminatedWordText gui=none cterm=none ctermbg=none guibg=#404040")
	end,
}
