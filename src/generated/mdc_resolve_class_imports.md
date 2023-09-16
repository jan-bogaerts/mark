# MarkdownCode > services > dialog service
{"DialogService": []}
# MarkdownCode > services > Theme service
{"ThemeService": []}
# MarkdownCode > services > Selection service
{"SelectionService": []}
# MarkdownCode > services > Undo service
{"UndoService": []}
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
# MarkdownCode > services > line parser
{"LineParser": [{"service": "LineParserHelpers", "path": "src\\services\\line_parser\\line_parser_helpers\\LineParserHelpers", "service_loc": "# MarkdownCode > services > line parser > line parser helpers"}, {"service": "ProjectService", "path": "src\\services\\project_service\\ProjectService", "service_loc": "# MarkdownCode > services > project service"}]}
# MarkdownCode > services > position-tracking service
{"PositionTrackingService": [{"service": "LineParser", "path": "src\\services\\line_parser\\LineParser", "service_loc": "# MarkdownCode > services > line parser"}]}
# MarkdownCode > services > project service > change-processor service
{"ChangeProcessorService": [{"service": "LineParser", "path": "src\\services\\line_parser\\LineParser", "service_loc": "# MarkdownCode > services > line parser"}, {"service": "ProjectService", "path": "src\\services\\project_service\\ProjectService", "service_loc": "# MarkdownCode > services > project service"}, {"service": "StorageService", "path": "src\\services\\project_service\\storage_service\\StorageService", "service_loc": "# MarkdownCode > services > project service > storage service"}]}
# MarkdownCode > services > build-stack service
{"BuildStackService": []}
# MarkdownCode > services > constant-extractor service
{"ConstantExtractorService": [{"service": "TransformerBaseService", "path": "src\\services\\transformer-base_service\\TransformerBaseService", "service_loc": "# MarkdownCode > services > transformer-base service"}]}
# MarkdownCode > services > project service
{"ProjectService": [{"service": "DialogService", "path": "src\\services\\dialog_service\\DialogService", "service_loc": "# MarkdownCode > services > dialog service"}, {"service": "CybertronService", "path": "src\\services\\cybertron_service\\CybertronService", "service_loc": "# MarkdownCode > services > cybertron service"}]}
# MarkdownCode > services > line parser > line parser helpers
{"LineParserHelpers": [{"service": "ProjectService", "path": "src\\services\\project_service\\ProjectService", "service_loc": "# MarkdownCode > services > project service"}]}
# MarkdownCode > services > project service > storage service
{"StorageService": [{"service": "FolderService", "path": "src\\services\\folder_service\\FolderService", "service_loc": "# MarkdownCode > services > folder service"}, {"service": "CybertronService", "path": "src\\services\\cybertron_service\\CybertronService", "service_loc": "# MarkdownCode > services > cybertron service"}, {"service": "PositionTrackingService", "path": "src\\services\\position-tracking_service\\PositionTrackingService", "service_loc": "# MarkdownCode > services > position-tracking service"}, {"service": "ProjectService", "path": "src\\services\\project_service\\ProjectService", "service_loc": "# MarkdownCode > services > project service"}]}
# MarkdownCode > services > result-cache service
{"ResultCacheService": [{"service": "FolderService", "path": "src\\services\\folder_service\\FolderService", "service_loc": "# MarkdownCode > services > folder service"}, {"service": "ProjectService", "path": "src\\services\\project_service\\ProjectService", "service_loc": "# MarkdownCode > services > project service"}]}
