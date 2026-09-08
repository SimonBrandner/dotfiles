return {
	"nvim-orgmode/orgmode",
	event = "VeryLazy",
	ft = "org",
	config = function()
		require("orgmode").setup({
			org_agenda_files = "~/orgfiles/**/*",
			org_default_notes_file = "~/orgfiles/refile.org",
		})
		vim.lsp.enable("org")
	end,
}
