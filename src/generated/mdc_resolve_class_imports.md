# MarkdownCode > services > dialog service
{"DialogService": []}
# MarkdownCode > services > Theme service
{"ThemeService": []}
# MarkdownCode > services > Selection service
{"SelectionService": []}
# MarkdownCode > services > Undo service
{"UndoService": []}
# MarkdownCode > services > line parser > line parser helpers
{"LineParserHelpers": [{"service": "ProjectService", "path": "src\\services\\project_service\\ProjectService", "service_loc": "# MarkdownCode > services > project service"}]}
# MarkdownCode > services > folder service
{"FolderService": []}
# MarkdownCode > services > gpt service
{"GPTService": []}
# MarkdownCode > services > cybertron service
{"CybertronService": []}
# MarkdownCode > services > transformer-base service
{"TransformerBaseService": [{"service": "ResultCacheService", "path": "src\\services\\result-cache_service\\ResultCacheService", "service_loc": "# MarkdownCode > services > result-cache service"}]}
# MarkdownCode > services > compress service
{"CompressService": [{"service": "CybertronService", "path": "src\\services\\cybertron_service\\CybertronService", "service_loc": "# MarkdownCode > services > cybertron service"}, {"service": "TransformerBaseService", "path": "src\\services\\transformer-base_service\\TransformerBaseService", "service_loc": "# MarkdownCode > services > transformer-base service"}]}
# MarkdownCode > services > build service
{"BuildService": [{"service": "ProjectService", "path": "src\\services\\project_service\\ProjectService", "service_loc": "# MarkdownCode > services > project service"}, {"service": "CybertronService", "path": "src\\services\\cybertron_service\\CybertronService", "service_loc": "# MarkdownCode > services > cybertron service"}]}
# MarkdownCode > services > project service
{"ProjectService": [{"service": "FolderService", "path": "src\\services\\folder_service\\FolderService", "service_loc": "# MarkdownCode > services > folder service"}, {"service": "CybertronService", "path": "src\\services\\cybertron_service\\CybertronService", "service_loc": "# MarkdownCode > services > cybertron service"}, {"service": "LineParser", "path": "src\\services\\line_parser\\LineParser", "service_loc": "# MarkdownCode > services > line parser"}]}
# MarkdownCode > services > line parser
{"LineParser": [{"service": "LineParserHelpers", "path": "src\\services\\line_parser\\line_parser_helpers\\LineParserHelpers", "service_loc": "# MarkdownCode > services > line parser > line parser helpers"}, {"service": "ProjectService", "path": "src\\services\\project_service\\ProjectService", "service_loc": "# MarkdownCode > services > project service"}]}
# MarkdownCode > services > position-tracking service
{"PositionTrackingService": []}
# MarkdownCode > services > result-cache service
{"ResultCacheService": [{"service": "FolderService", "path": "src\\services\\folder_service\\FolderService", "service_loc": "# MarkdownCode > services > folder service"}, {"service": "ProjectService", "path": "src\\services\\project_service\\ProjectService", "service_loc": "# MarkdownCode > services > project service"}]}
