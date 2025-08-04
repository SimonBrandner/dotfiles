return {
	{
		"Zeta611/tex2uni.nvim",
		opts = {
			ft = { "*.{agda}" }, -- enable for specific filetypes
			abbreviations = {
				extra = {
					["pure"] = "⌜$CURSOR⌝", -- add custom abbreviations
				},
			},
		},
	},
}
