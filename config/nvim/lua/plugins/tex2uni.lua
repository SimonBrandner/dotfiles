return {
	{
		"Zeta611/tex2uni.nvim",
		opts = {
			ft = { "*.{agda}", "*.{lagda.md}", "*.{lagda.tex}", "*.{lagda.typ}", "*.{v}" }, -- enable for specific filetypes
			abbreviations = {
				extra = {
					["pure"] = "⌜$CURSOR⌝", -- add custom abbreviations
					["="] = "＝", -- add custom abbreviations
				},
			},
		},
	},
}
