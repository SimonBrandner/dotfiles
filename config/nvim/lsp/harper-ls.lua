return {
	cmd = { "harper-ls", "--stdio" },
	filetypes = { "typst", "markdown", "tex" },
	settings = {
		["harper-ls"] = {
			userDictPath = "",
			workspaceDictPath = "",
			fileDictPath = "",
			linters = {
				SpellCheck = true,
				SpelledNumbers = false,
				AnA = true,
				SentenceCapitalization = true,
				UnclosedQuotes = true,
				WrongQuotes = false,
				LongSentences = true,
				RepeatedWords = true,
				Spaces = true,
				Matcher = true,
				CorrectNumberSuffix = true,
			},
			codeActions = {
				ForceStable = false,
			},
			markdown = {
				IgnoreLinkTitle = false,
			},
			diagnosticSeverity = "hint",
			isolateEnglish = false,
			dialect = "British",
			maxFileLength = 120000,
			ignoredLintsPath = "",
			excludePatterns = {},
		},
	},
}
