import os

# Define the folder + file structure
structure = {
    "src": {
        "lib": {
            "supabase.ts": ""
        },
        "store": {
            "cartStore.ts": ""
        },
        "app": {
            "(customer)": {
                "layout.tsx": "",
                "page.tsx": "",
                "orders": {}
            },
            "(admin)": {
                "layout.tsx": "",
                "dashboard": {},
                "inventory": {},
                "dispatch": {}
            },
            "(delivery)": {
                "layout.tsx": "",
                "queue": {}
            },
            "login": {
                "page.tsx": ""
            },
            "globals.css": ""
        }
    }
}

def create_structure(base_path, tree):
    for name, content in tree.items():
        path = os.path.join(base_path, name)
        
        if isinstance(content, dict):
            # Create directory
            os.makedirs(path, exist_ok=True)
            create_structure(path, content)
        else:
            # Create file
            with open(path, "w") as f:
                f.write(content)

# Run the function
create_structure(".", structure)

print("Folder structure created successfully!")