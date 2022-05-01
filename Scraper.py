from selenium import webdriver
from selenium.webdriver.common.by import By
from time import sleep
from PIL import Image
import requests, io, json, re

tables_names = [
    "WHITE",
    "GREEN",
    "RED",
    "YELLOW",
    "BLUE",
    "MAGENTA",
    "ORANGE",
    "BLUE EQUIPMENT",
    "ELITE"
]

sel = webdriver.Firefox()

sel.get("https://riskofrain2.fandom.com/wiki/Items")
sleep(5)

try:
    sel.find_element(By.XPATH, "/html/body/div[6]/div/div/div[2]/div[2]").click()
except:
    pass

try:
    sel.find_element(By.XPATH, "/html/body/div[7]/div/div/div[2]/div[2]").click()
except:
    pass

sleep(2)

def get_table(table_xpath):
    try:
        return sel.find_element(By.XPATH, table_xpath)
    except:
        return None

def download_image(url, file_name):
	try:
		image_content = requests.get(url).content
		image_file = io.BytesIO(image_content)
		image = Image.open(image_file)

		with open(file_name, "wb") as f:
			image.save(f, "PNG")
        
	except Exception as e:
		print(f'Failed to download {file_name} - {e}')

def extract_table(table: str) -> list:

    extracted = []

    for child in table.find_elements(By.TAG_NAME, "tr"):
        try:
            name_td = child.find_element(By.TAG_NAME, "td")
            content_td = child.find_elements(By.TAG_NAME, "td")[1]
            image = name_td.find_element(By.TAG_NAME, "div").find_element(By.TAG_NAME, "div").find_element(By.TAG_NAME, "a").find_element(By.TAG_NAME, "img")
            name = name_td.get_attribute("data-sort-value").replace("'", "")
            content = content_td.get_attribute("innerHTML").replace("'", "")
            content = re.sub("<a.*?>", "", content).replace("</a>", "").replace("\n", " ")
            image_src = "images/" + name + ".png"
            download_image(image.get_attribute("data-src"), image_src)
            extracted.append({
                "Name" : name,
                "Content" : content,
                "Image" : image_src
            })
        except:
            print("Error parsing child")
    
    return extracted

def scroll_page():
    sel.execute_script(f"window.scrollTo(0, document.body.scrollHeight)") 

scroll_page()
tables_json = []
tables_arr = []
counter = 0
for i in range(4, 15):
    table = get_table(f'/html/body/div[4]/div[3]/div[3]/main/div[3]/div[2]/div/div[{i}]/table/tbody')
    if (table != None) and not (table in tables_arr):
        extracted = extract_table(table)
        tables_json.append({
            "Name" : tables_names[counter],
            "Table" : extracted
        })
        print(f"Extracted {tables_names[counter]} - index {i}")
        counter += 1
        tables_arr.append(table)

with open("info.json", "w") as file:
    file.write(json.dumps(tables_json))

print("Finished")
