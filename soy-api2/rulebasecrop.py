import os
import math

import cv2
import numpy as np
import matplotlib.pyplot as plt

def rotate_image(gray_image):
    th1, th2 = 150, 180
    hough_th, hough_min, hough_max = 150, 50, 50

    blurred = cv2.GaussianBlur(gray_image, (5, 5), 1.5)
    edges = cv2.Canny(blurred, th1, th2, apertureSize=3)
    lines = cv2.HoughLinesP(edges, 1, np.pi/360, threshold=hough_th, minLineLength=hough_min, maxLineGap=hough_max)

    angles = []
    if lines is not None:
        for x1, y1, x2, y2 in lines[:, 0]:
            angle_rad = math.atan2((y2 - y1), (x2 - x1))
            angle_deg = math.degrees(angle_rad)
            angles.append(angle_deg)
            print(f"Line: ({x1}, {y1}) to ({x2}, {y2}), Angle: {angle_deg:.2f} degrees")
            
        if angles:
            average_angle = np.mean(angles)
            print(f"Average angle: {average_angle:.2f} degrees")

    (h, w) = gray_image.shape[:2]
    center = (w // 2, h // 2)

    M = cv2.getRotationMatrix2D(center, average_angle, 1.0)
    rotated_img = cv2.warpAffine(blurred, M, (w, h), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
    
    return average_angle, rotated_img

def find_edges_line(img, hor_threshold, ver_threshold):
    h, w = img.shape
    center_y, center_x = h // 2, w // 2
    results = {}

    # 상단에서 아래
    for y in range(center_y):
        if np.sum(img[y, :]) > hor_threshold:
            results['top'] = y
            break
    else: results['top'] = 0

    # 하단에서 위
    for y in range(h - 1, center_y, -1):
        if np.sum(img[y, :]) > hor_threshold:
            results['bottom'] = y
            break
    else: results['bottom'] = h - 1

    # 왼쪽에서 오른쪽
    for x in range(center_x):
        if np.sum(img[:, x]) > ver_threshold:
            results['left'] = x
            break
    else: results['left'] = 0

    # 오른쪽에서 왼쪽
    for x in range(w - 1, center_x, -1):
        if np.sum(img[:, x]) > ver_threshold:
            results['right'] = x
            break
    else: results['right'] = w - 1

    cropped_image = img[results['top']:results['bottom'], results['left']:results['right']]

    return results, cropped_image

def crop_zero2fifth(image):
    left_crop_image = image[:, int(image.shape[1]*0.12):]
    h, w = left_crop_image.shape 
    print("crop_blur_copy_crop shape:", left_crop_image.shape)
    print(left_crop_image[int(h*0.36), :].shape)
    pixel_data = left_crop_image[int(h*0.36), :].astype(np.int16)
    print(max(pixel_data), min(pixel_data))
    pixel_deriv = np.diff(pixel_data, n=1)

    fig, ax1 = plt.subplots(figsize=(10, 5))
    ax1.plot(pixel_data, color='b', label='pixel_data', marker='o')
    ax1.set_xlabel("Index")
    ax1.set_ylabel("Pixel Value", color='b')
    ax1.tick_params(axis='y', labelcolor='b')
    ax1.grid(True)
    ax2 = ax1.twinx()
    ax2.plot(pixel_deriv, color='r', label='y_deriv', marker='o')
    ax2.set_ylabel("y_deriv", color='r')
    ax2.tick_params(axis='y', labelcolor='r')
    plt.tight_layout()
    plt.savefig("pixelandderiv.jpg")

    marks = []
    flag = False
    for idx in range(len(pixel_deriv)):
        if flag == True:
            if abs(pixel_deriv[idx]) <= 1:
                marks.append(idx)
                flag = False
        elif pixel_deriv[idx] <= -4:
            flag = True

    print("marks:", *marks)

    all_marks = []
    for i in range(len(marks)-1):
        interv = (marks[i+1]-marks[i])//5
        all_marks.extend(list(range(marks[i], marks[i+1]-interv+1, interv)))
    all_marks.sort()
    all_marks.append(marks[-1])

    for j in all_marks:
        cv2.line(left_crop_image, (j, 0), (j, left_crop_image.shape[0]), (0, 0, 0), 2)


    crop_image = left_crop_image[:, marks[0]:marks[-1]]

    return all_marks, crop_image

image_path = os.path.join("yolo_run", 'real_test.jpg')
image = cv2.imread(image_path)
gray_img = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

average_angle, rotated_img = rotate_image(gray_img)
line_results, line_cropped_image = find_edges_line(rotated_img, 25000, 20000)
all_marks, cropped_image = crop_zero2fifth(line_cropped_image)
print("cropped image shape:", cropped_image.shape)
print("all_marks:", all_marks)

# cv2.line(line_cropped_image, (120, 0), (120, 400), (0, 0, 255), 1)
# cv2.line(line_cropped_image, (150, 0), (150, 400), (0, 0, 255), 1)
cv2.imshow("Line Cropped Image", line_cropped_image)
cv2.imshow("Cropped Image", cropped_image)
cv2.waitKey(0)
cv2.destroyAllWindows()
