# MarkdownCode > services > Theme service
{"ThemeService": []}
# MarkdownCode > services > Selection service
{"SelectionService": []}
# MarkdownCode > services > Undo service
{"UndoService": []}
# MarkdownCode > services > folder service
{"FolderService": []}
# MarkdownCode > services > cybertron service
{"CybertronService": []}
# MarkdownCode > services > build-stack service
{"BuildStackService": []}
# MarkdownCode > services > result-cache service
{"ResultCacheService": [{"service": "FolderService", "path": "src\\services\\folder_service\\FolderService", "service_loc": "# MarkdownCode > services > folder service"}, {"service": "ProjectService", "path": "src\\services\\project_service\\ProjectService", "service_loc": "# MarkdownCode > services > project service"}]}
# MarkdownCode > services > dialog service
{"DialogService": []}
# MarkdownCode > services > project service > change-processor service
{"ChangeProcessorService": [{"service": "StorageService", "path": "src\\services\\project_service\\storage_service\\StorageService", "service_loc": "# MarkdownCode > services > project service > storage service"}, {"service": "ProjectService", "path": "src\\services\\project_service\\ProjectService", "service_loc": "# MarkdownCode > services > project service"}, {"service": "LineParser", "path": "src\\services\\line_parser\\LineParser", "service_loc": "# MarkdownCode > services > line parser"}]}
# MarkdownCode > services > gpt service
{"GPTService": [{"service": "DialogService", "path": "src\\services\\dialog_service\\DialogService", "service_loc": "# MarkdownCode > services > dialog service"}]}
# MarkdownCode > services > transformers > double-compress service
{"double-compress-service": [{"service": "CompressService", "path": "src\\services\\compress_service\\CompressService", "service_loc": "# MarkdownCode > services > transformers > compress service"}, {"service": "TransformerBaseService", "path": "src\\services\\transformer-base_service\\TransformerBaseService", "service_loc": "# MarkdownCode > services > transformer-base service"}]}
# MarkdownCode > services > all-spark service
{"AllSparkService": [{"service": "CybertronService", "path": "src\\services\\cybertron_service\\CybertronService", "service_loc": "# MarkdownCode > services > cybertron service"}, {"service": "CompressService", "path": "src\\services\\compress_service\\CompressService", "service_loc": "# MarkdownCode > services > transformers > compress service"}, {"service": "ConstantExtractorService", "path": "src\\services\\constant-extractor_service\\ConstantExtractorService", "service_loc": "# MarkdownCode > services > transformers > constant-extractor service"}, {"service": "double-compress-service", "path": "src\\services\\double-compress_service\\double-compress-service", "service_loc": "# MarkdownCode > services > transformers > double-compress service"}]}
# MarkdownCode > services > project service
{"ProjectService": [{"service": "CybertronService", "path": "src\\services\\cybertron_service\\CybertronService", "service_loc": "# MarkdownCode > services > cybertron service"}, {"service": "DialogService", "path": "src\\services\\dialog_service\\DialogService", "service_loc": "# MarkdownCode > services > dialog service"}]}
# MarkdownCode > services > transformers > triple-compress service
{"TripleCompressService": [ {"service": "TransformerBaseService", "path": "src\\services\\transformer-base_service\\TransformerBaseService", "service_loc": "# MarkdownCode > services > transformer-base service"}, {"service": "double-compress-service", "path": "src\\services\\transformers\\double-compress_service\\double-compress-service", "service_loc": "# MarkdownCode > services > transformers > double-compress service"}]}
# MarkdownCode > services > transformers > component-lister service
{"component-lister service": [{"service": "TransformerBaseService", "path": "src\\services\\transformer-base_service\\TransformerBaseService", "service_loc": "# MarkdownCode > services > transformer-base service"}, {"service": "ProjectService", "path": "src\\services\\project_service\\ProjectService", "service_loc": "# MarkdownCode > services > project service"}]}
# MarkdownCode > services > position-tracking service
{"PositionTrackingService": [{"service": "LineParser", "path": "src\\services\\line_parser\\LineParser", "service_loc": "# MarkdownCode > services > line parser"}]}
# MarkdownCode > services > build service
{"BuildService": [{"service": "CybertronService", "path": "src\\services\\cybertron_service\\CybertronService", "service_loc": "# MarkdownCode > services > cybertron service"}, {"service": "ProjectService", "path": "src\\services\\project_service\\ProjectService", "service_loc": "# MarkdownCode > services > project service"}]}
# MarkdownCode > services > transformers > compress service
{"CompressService": [{"service": "TransformerBaseService", "path": "src\\services\\transformer-base_service\\TransformerBaseService", "service_loc": "# MarkdownCode > services > transformer-base service"}]}
# MarkdownCode > services > transformer-base service
{"TransformerBaseService": [{"service": "CybertronService", "path": "src\\services\\cybertron_service\\CybertronService", "service_loc": "# MarkdownCode > services > cybertron service"}, {"service": "BuildStackService", "path": "src\\services\\build-stack_service\\BuildStackService", "service_loc": "# MarkdownCode > services > build-stack service"}, {"service": "ResultCacheService", "path": "src\\services\\result-cache_service\\ResultCacheService", "service_loc": "# MarkdownCode > services > result-cache service"}, {"service": "GPTService", "path": "src\\services\\gpt_service\\GPTService", "service_loc": "# MarkdownCode > services > gpt service"}]}
# MarkdownCode > services > project service > project configuration service
{"ProjectConfigurationService": []}
# MarkdownCode > services > transformers > plugin-transformer service
{"PluginTransformerService": [{"service": "FolderService", "path": "src\\services\\folder_service\\FolderService", "service_loc": "# MarkdownCode > services > folder service"}, {"service": "CybertronService", "path": "src\\services\\cybertron_service\\CybertronService", "service_loc": "# MarkdownCode > services > cybertron service"}, {"service": "GPTService", "path": "src\\services\\gpt_service\\GPTService", "service_loc": "# MarkdownCode > services > gpt service"}, {"service": "ProjectService", "path": "src\\services\\project_service\\ProjectService", "service_loc": "# MarkdownCode > services > project service"}, {"service": "TransformerBaseService", "path": "src\\services\\transformer-base_service\\TransformerBaseService", "service_loc": "# MarkdownCode > services > transformer-base service"}]}
# MarkdownCode > services > transformers > plugin-list renderer service
{"PluginListRendererService": [{"service": "FolderService", "path": "src\\services\\folder_service\\FolderService", "service_loc": "# MarkdownCode > services > folder service"},{"service": "TransformerBaseService", "path": "src\\services\\transformer-base_service\\TransformerBaseService", "service_loc": "# MarkdownCode > services > transformer-base service"}]}
# MarkdownCode > services > transformers > constant-extractor service
{"ConstantExtractorService": [{"service": "TransformerBaseService", "path": "src\\services\\transformer-base_service\\TransformerBaseService", "service_loc": "# MarkdownCode > services > transformer-base service"}]}
# MarkdownCode > services > transformers > constants-resource renderer
{"ConstantsResourceRenderer": [{"service": "FolderService", "path": "src\\services\\folder_service\\FolderService", "service_loc": "# MarkdownCode > services > folder service"}, {"service": "TransformerBaseService", "path": "src\\services\\transformer-base_service\\TransformerBaseService", "service_loc": "# MarkdownCode > services > transformer-base service"}]}
# MarkdownCode > services > transformers > parser validator service
{"ParserValidatorService": [{"service": "TransformerBaseService", "path": "src\\services\\transformer-base_service\\TransformerBaseService", "service_loc": "# MarkdownCode > services > transformer-base service"}]}
# MarkdownCode > services > key service
{"KeyService": [{"service": "ProjectService", "path": "src\\services\\project_service\\ProjectService", "service_loc": "# MarkdownCode > services > project service"}]}
# MarkdownCode > services > project service > storage service
{"StorageService": [{"service": "FolderService", "path": "src\\services\\folder_service\\FolderService", "service_loc": "# MarkdownCode > services > folder service"}, {"service": "CybertronService", "path": "src\\services\\cybertron_service\\CybertronService", "service_loc": "# MarkdownCode > services > cybertron service"}, {"service": "LineParser", "path": "src\\services\\line_parser\\LineParser", "service_loc": "# MarkdownCode > services > line parser"}, {"service": "GPTService", "path": "src\\services\\gpt_service\\GPTService", "service_loc": "# MarkdownCode > services > gpt service"}, {"service": "ProjectService", "path": "src\\services\\project_service\\ProjectService", "service_loc": "# MarkdownCode > services > project service"}, {"service": "PositionTrackingService", "path": "src\\services\\position-tracking_service\\PositionTrackingService", "service_loc": "# MarkdownCode > services > position-tracking service"}, {"service": "ProjectConfigurationService", "path": "src\\services\\project_service\\project_configuration_service\\ProjectConfigurationService", "service_loc": "# MarkdownCode > services > project service > project configuration service"}, {"service": "KeyService", "path": "src\\services\\key_service\\KeyService", "service_loc": "# MarkdownCode > services > key service"}]}
# MarkdownCode > services > line parser
{"LineParser": [{"service": "LineParserHelpers", "path": "src\\services\\line_parser\\line_parser_helpers\\LineParserHelpers", "service_loc": "# MarkdownCode > services > line parser > line parser helpers"}, {"service": "ProjectService", "path": "src\\services\\project_service\\ProjectService", "service_loc": "# MarkdownCode > services > project service"}, {"service": "KeyService", "path": "src\\services\\key_service\\KeyService", "service_loc": "# MarkdownCode > services > key service"}]}
# MarkdownCode > services > line parser > line parser helpers
{"LineParserHelpers": [{"service": "ProjectService", "path": "src\\services\\project_service\\ProjectService", "service_loc": "# MarkdownCode > services > project service"}]}
# MarkdownCode > services > log service
{"LogService": []}
# MarkdownCode > services > transformers > plugin-renderer service
{"PluginRendererService": [{"service": "FolderService", "path": "src\\services\\folder_service\\FolderService", "service_loc": "# MarkdownCode > services > folder service"}, {"service": "GPTService", "path": "src\\services\\gpt_service\\GPTService", "service_loc": "# MarkdownCode > services > gpt service"}, {"service": "ProjectService", "path": "src\\services\\project_service\\ProjectService", "service_loc": "# MarkdownCode > services > project service"}, {"service": "TransformerBaseService", "path": "src\\services\\transformer-base_service\\TransformerBaseService", "service_loc": "# MarkdownCode > services > transformer-base service"}, {"service": "KeyService", "path": "src\\services\\key_service\\KeyService", "service_loc": "# MarkdownCode > services > key service"}]}
