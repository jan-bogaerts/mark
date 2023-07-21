from dotenv import load_dotenv
import os
import json

# Load environment variables from .env file (OPENAI_API_KEY)
load_dotenv()

EXTENSION_TO_SKIP = [".png",".jpg",".jpeg",".gif",".bmp",".svg",".ico",".tif",".tiff"]
DEFAULT_DIR = "generated"
DEFAULT_MODEL = "gpt-3.5-turbo" # we recommend 'gpt-4' if you have it # gpt3.5 is going to be worse at generating code so we strongly recommend gpt4. i know most people dont have access, we are working on a hosted version 
DEFAULT_MAX_TOKENS = 2000 # i wonder how to tweak this properly. we dont want it to be max length as it encourages verbosity of code. but too short and code also truncates suddenly.
OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')

file = os.path.join(os.path.dirname(__file__), "../src/Pelikaan_models.json")
if os.path.exists(file):
    MODELS_CONFIG = json.load(open(file, "r"))
else:
    MODELS_CONFIG = {}


def get_model_config(model_name, topic=None):
    found = None
    if model_name in MODELS_CONFIG:
        found = MODELS_CONFIG[model_name]
    if found:
        if topic and topic in found["topics"]:
            return found["topics"][topic]
        return found["default"] or DEFAULT_MODEL
    return DEFAULT_MODEL