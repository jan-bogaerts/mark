# MarkdownCode > services > dialog service
{"DialogService": []}
# MarkdownCode > services > Theme service
{"ThemeService": []}
# MarkdownCode > services > project service
{"ProjectService": []}
# MarkdownCode > services > Selection service
{"SelectionService": []}
# MarkdownCode > services > Undo service
{"UndoService": []}
# MarkdownCode > services > line parser
{"LineParser": [{"service": "ProjectService", "path": "src\\services\\project_service\\ProjectService", "service_loc": "# MarkdownCode > services > project service"}]}
# MarkdownCode > services > position-tracking service
{"PositionTrackingService": [{"service": "SelectionService", "path": "src\\services\\Selection_service\\SelectionService", "service_loc": "# MarkdownCode > services > Selection service"}]}
# MarkdownCode > services > gpt service
{"GptService": []}
# MarkdownCode > services > result-cache service
{"ResultCacheService": [{"service": "ProjectService", "path": "src\\services\\project_service\\ProjectService", "service_loc": "# MarkdownCode > services > project service"}]}
# MarkdownCode > services > build service
{"BuildService": [{"service": "ProjectService", "path": "src\\services\\project_service\\ProjectService", "service_loc": "# MarkdownCode > services > project service"}, {"service": "GptService", "path": "src\\services\\gpt_service\\GptService", "service_loc": "# MarkdownCode > services > gpt service"}, {"service": "CompressService", "path": "src\\services\\compress_service\\CompressService", "service_loc": "# MarkdownCode > services > compress service"}]}
# MarkdownCode > services > compress service
{"CompressService": [{"service": "GptService", "path": "src\\services\\gpt_service\\GptService", "service_loc": "# MarkdownCode > services > gpt service"}, {"service": "ResultCacheService", "path": "src\\services\\result-cache_service\\ResultCacheService", "service_loc": "# MarkdownCode > services > result-cache service"}], "ResultCacheService": "src\\services\\result-cache service\\ResultCacheService"}
