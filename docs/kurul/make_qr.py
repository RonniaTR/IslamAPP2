#!/usr/bin/env python3
"""Kurul inceleme bağlantısı için karekod üretir.
Kullanım:  python make_qr.py "https://…/?inceleme=1"  [cikti.png]
Gerekli:   pip install qrcode pillow
"""
import sys
import qrcode
from qrcode.constants import ERROR_CORRECT_Q
from PIL import Image, ImageDraw, ImageFont

url = sys.argv[1] if len(sys.argv) > 1 else "https://islamapp-5942a.web.app/?inceleme=1"
out = sys.argv[2] if len(sys.argv) > 2 else "inceleme-karekod.png"

qr = qrcode.QRCode(error_correction=ERROR_CORRECT_Q, box_size=14, border=4)
qr.add_data(url)
qr.make(fit=True)
img = qr.make_image(fill_color="black", back_color="white").convert("RGB")

# Altına okunur biçimde adres ve açıklama yaz (karekod okunamazsa elle girilebilsin).
pad = 150
canvas = Image.new("RGB", (img.width, img.height + pad), "white")
canvas.paste(img, (0, 0))
d = ImageDraw.Draw(canvas)
try:
    f1 = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 26)
    f2 = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 20)
except OSError:
    f1 = f2 = ImageFont.load_default()
def center(text, y, font):
    w = d.textlength(text, font=font)
    d.text(((canvas.width - w) / 2, y), text, fill="black", font=font)
center("Kur'an bölümü inceleme bağlantısı", img.height + 5, f1)
center(url, img.height + 50, f2)
center("Giriş ekranında \"Misafir olarak devam et\" seçilir.", img.height + 90, f2)
canvas.save(out)
print(out, canvas.size, url)
