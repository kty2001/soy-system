import os
import glob

import cv2
import pandas as pd

label_list = ["7", "7.5", "8", "8.5", "9"]
data_list = []

for label_name in label_list:
    img_list = glob.glob(os.path.join("./images", label_name, "5", "*.jpg"))
    for img_path in img_list:
        img_name = os.path.basename(img_path)
        ori_img = cv2.imread(img_path)
        gray_img = cv2.cvtColor(ori_img, cv2.COLOR_BGR2GRAY)

        min_y, max_y = 450, 850
        min_x, max_x = 530, 1230
        mid_y = (max_y - min_y) // 2
            
        cut_gray_img = gray_img[min_y:max_y, min_x:max_x]
        gray_data = cut_gray_img[mid_y, :].tolist()

        data_list.append({
            "img_name": img_name,
            "label_name": label_name,
            "gray_data": gray_data
        })

df = pd.DataFrame(data_list)

csv_file_path = os.path.join("./images", "data.csv")
df.to_csv(csv_file_path, index=False, encoding='utf-8')
