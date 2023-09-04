# MarkdownCode > services > dialog service
{"DialogService": []}
# MarkdownCode > services > Theme service
{"ThemeService": []}
# MarkdownCode > services > Selection service
{"SelectionService": []}
# MarkdownCode > services > Undo service
{"UndoService": []}
# MarkdownCode > services > position-tracking service
{"PositionTrackingService": [{"service": "SelectionService", "path": "src\\services\\Selection_service\\SelectionService", "service_loc": "# MarkdownCode > services > Selection service"}]}
# MarkdownCode > services > line parser
{"LineParser": [{"service": "ProjectService", "path": "src\\services\\project_service\\ProjectService", "service_loc": "# MarkdownCode > services > project service"}, {"service": "LineParserHelpers", "path": "src\\services\\line_parser\\line_parser_helpers\\LineParserHelpers", "service_loc": "# MarkdownCode > services > line parser > line parser helpers"}], "lineParserHelpers": "src\\services\\line parser\\line parser helpers\\LineParserHelpers"}
# MarkdownCode > services > line parser > line parser helpers
{"LineParserHelpers": [{"service": "ProjectService", "path": "src\\services\\project_service\\ProjectService", "service_loc": "# MarkdownCode > services > project service"}]}
# MarkdownCode > services > folder service
{"FolderService": []}
# MarkdownCode > services > result-cache service
{"ResultCacheService": [{"service": "ProjectService", "path": "src\\services\\project_service\\ProjectService", "service_loc": "# MarkdownCode > services > project service"}, {"service": "FolderService", "path": "src\\services\\folder_service\\FolderService", "service_loc": "# MarkdownCode > services > folder service"}]}
# MarkdownCode > services > project service
{"ProjectService": [{"service": "LineParser", "path": "src\\services\\line_parser\\LineParser", "service_loc": "# MarkdownCode > services > line parser"}, {"service": "FolderService", "path": "src\\services\\folder_service\\FolderService", "service_loc": "# MarkdownCode > services > folder service"}]}
# MarkdownCode > services > gpt service
{"GPTService": []}
# MarkdownCode > services > build service
{"BuildService": [{"service": "CybertronService", "path": "src\\services\\cybertron_service\\CybertronService", "service_loc": "# MarkdownCode > services > cybertron service"}]}
# MarkdownCode > services > cybertron service
{"CybertronService": []}
# MarkdownCode > services > transformer-base service
{"TransformerBaseService": [{"service": "ResultCacheService", "path": "src\\services\\result-cache_service\\ResultCacheService", "service_loc": "# MarkdownCode > services > result-cache service"}]}
# MarkdownCode > services > compress service
{"CompressService": [{"service": "TransformerBaseService", "path": "src\\services\\transformer-base_service\\TransformerBaseService", "service_loc": "# MarkdownCode > services > transformer-base service"}]}
