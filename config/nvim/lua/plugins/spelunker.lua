return {
	"kamykn/spelunker.vim",
	dependencies = {"kamykn/popup-menu.nvim"},
	config = function ()
		vim.cmd("highlight SpelunkerSpellBad cterm=undercurl ctermfg=247 gui=undercurl guifg=#9e9e9e guisp=red")
		vim.cmd("highlight SpelunkerComplexOrCompoundWord cterm=undercurl ctermfg=NONE gui=undercurl guifg=NONE guisp=gray")
	end
}
