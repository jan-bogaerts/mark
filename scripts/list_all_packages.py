import package_extractor
import json

if __name__ == "__main__":
    package_extractor.load_results('C:\\Users\\janbo\\Documents\\dev\\markdownCode\\src\\generated\\mdc_packages.md')
    packages = {}
    for fragment in package_extractor.text_fragments:
        if fragment.data:
            for file, data in fragment.data.items():
                json_data = json.loads(data)
                for package, version in json_data.items():
                    packages[package] = version
    print(json.dumps(packages, indent=2))