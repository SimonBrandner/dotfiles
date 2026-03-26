require("full-border"):setup({
	type = ui.Border.ROUNDED,
})

require("smart-enter"):setup({
	open_multi = true,
})

th.git = th.git or {}
th.git.unknown_sign = " "
th.git.modified_sign = "M"
th.git.added_sign = "A"
th.git.untracked_sign = "?"
th.git.ignored_sign = "!"
th.git.deleted_sign = "D"
th.git.updated_sign = "U"
th.git.clean_sign = "✔"

require("git"):setup({
	order = 1500,
})
