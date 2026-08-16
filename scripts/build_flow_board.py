"""Stitch Renewly wireframe screenshots into a single presentation-ready flow board PNG."""
import os
from PIL import Image, ImageDraw, ImageFont

SRC = "/app/screenshots"
OUT = "/app/screenshots/renewly_flow_board.png"

# ---- palette ----
BG = (248, 250, 252)
TEAL = (15, 118, 110)
AMBER = (245, 158, 11)
SLATE = (30, 41, 59)
SUB = (100, 116, 139)
CARD_BORDER = (226, 232, 240)
SHADOW = (15, 23, 42, 28)

# ---- fonts ----
FD = "/usr/share/fonts/truetype/dejavu"
def font(size, bold=False):
    try:
        return ImageFont.truetype(f"{FD}/DejaVuSans{'-Bold' if bold else ''}.ttf", size)
    except OSError:
        return ImageFont.load_default()

F_TITLE = font(52, True)
F_TAG = font(24)
F_SECTION = font(30, True)
F_CAP = font(19, True)
F_ARROW = font(17)
F_NOTE = font(19)

# ---- layout constants ----
THUMB_W, THUMB_H = 234, 520          # main rows (scaled from 360x800)
DARK_W, DARK_H = 189, 420            # dark mode gallery
ARROW_W = 110
GROUP_GAP = 90
MARGIN = 80
CAP_H = 46
SECTION_H = 64
ROW_GAP = 70
CORNER = 18

# Row spec: list of tokens
#   ("img", filename, caption)  ("arrow", label)  ("gap",)  ("note", text)
ROWS = [
    ("1 · Entry & Auth", THUMB_W, THUMB_H, [
        ("img", "01_landing.png", "01 · Landing"),
        ("arrow", "Create account"),
        ("img", "02_auth_signup.png", "02 · Sign up"),
        ("arrow", "switch mode"),
        ("img", "03_auth_signin.png", "03 · Sign in"),
        ("note", "Sign up → Onboarding\nSign in → Home"),
    ]),
    ("2 · Onboarding (after sign-up)", THUMB_W, THUMB_H, [
        ("img", "04_onboarding_1.png", "04 · Frame 1"),
        ("arrow", "Next"),
        ("img", "05_onboarding_2.png", "05 · Frame 2"),
        ("arrow", "Next"),
        ("img", "06_onboarding_3.png", "06 · Frame 3"),
        ("note", "Allow SMS / Skip\n→ Home"),
    ]),
    ("3 · Home · Swipe Actions · Savings", THUMB_W, THUMB_H, [
        ("img", "07_home.png", "07 · Home"),
        ("arrow", "swipe left"),
        ("img", "08_home_swipe_actions.png", "08 · Snooze / Cancel"),
        ("arrow", "mark cancelled"),
        ("img", "16_savings.png", "16 · Savings tracker"),
    ]),
    ("4 · Calendar · Detail · Family Split", THUMB_W, THUMB_H, [
        ("img", "09_calendar.png", "09 · Calendar"),
        ("arrow", "tap 19 Sep"),
        ("img", "10_calendar_day_sheet.png", "10 · Day sheet"),
        ("arrow", "open Netflix"),
        ("img", "13_detail_family_split.png", "13 · Detail + split"),
        ("arrow", "How to cancel"),
        ("img", "14_detail_cancel_sheet.png", "14 · Cancel sheet"),
    ]),
    ("5 · Add · Alerts · Renewly Plus", THUMB_W, THUMB_H, [
        ("img", "11_add_pick_service.png", "11 · Add — pick"),
        ("arrow", "pick service"),
        ("img", "12_add_details.png", "12 · Add — details"),
        ("gap",),
        ("img", "15_alerts.png", "15 · Alerts"),
        ("gap",),
        ("img", "17_settings.png", "17 · Settings"),
        ("arrow", "Renewly Plus"),
        ("img", "18_paywall.png", "18 · Paywall"),
    ]),
    ("6 · Dark Mode", DARK_W, DARK_H, [
        ("img", "19_dark_landing.png", "19 · Landing"),
        ("gap",),
        ("img", "20_dark_auth.png", "20 · Auth"),
        ("gap",),
        ("img", "21_dark_home.png", "21 · Home"),
        ("gap",),
        ("img", "22_dark_calendar.png", "22 · Calendar"),
        ("gap",),
        ("img", "23_dark_detail.png", "23 · Detail"),
        ("gap",),
        ("img", "24_dark_savings.png", "24 · Savings"),
        ("gap",),
        ("img", "25_dark_settings.png", "25 · Settings"),
        ("gap",),
        ("img", "26_dark_paywall.png", "26 · Paywall"),
    ]),
]

def row_width(tw, tokens):
    w = 0
    for t in tokens:
        if t[0] == "img": w += tw
        elif t[0] == "arrow": w += ARROW_W
        elif t[0] == "gap": w += GROUP_GAP
        elif t[0] == "note": w += 300
    return w

def rounded_thumb(path, w, h):
    img = Image.open(path).convert("RGB").resize((w, h), Image.LANCZOS)
    mask = Image.new("L", (w, h), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, w - 1, h - 1], CORNER, fill=255)
    out = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    out.paste(img, (0, 0), mask)
    return out

def draw_arrow(d, x0, x1, y, label):
    d.line([x0 + 14, y, x1 - 20, y], fill=TEAL, width=4)
    d.polygon([(x1 - 20, y - 9), (x1 - 20, y + 9), (x1 - 4, y)], fill=TEAL)
    if label:
        tw = d.textlength(label, font=F_ARROW)
        d.text(((x0 + x1 - tw) / 2, y - 34), label, font=F_ARROW, fill=SUB)

HEADER_H = 190
total_w = max(row_width(tw, tokens) for _, tw, _, tokens in ROWS) + 2 * MARGIN
total_h = HEADER_H + sum(SECTION_H + th + CAP_H + ROW_GAP for _, _, th, _ in ROWS) + MARGIN

board = Image.new("RGB", (total_w, total_h), BG)
d = ImageDraw.Draw(board, "RGBA")

# subtle dot grid
for gx in range(MARGIN, total_w - MARGIN, 48):
    for gy in range(HEADER_H, total_h - MARGIN, 48):
        d.ellipse([gx, gy, gx + 2, gy + 2], fill=(203, 213, 225, 90))

# ---- header ----
# brand mark
bx, by, bs = MARGIN, 52, 76
d.rounded_rectangle([bx, by, bx + bs, by + bs], 21, fill=TEAL)
d.text((bx + bs / 2 - d.textlength("R", font=font(40, True)) / 2, by + 14), "R", font=font(40, True), fill=(255, 255, 255))
d.ellipse([bx + bs - 22, by + 10, bx + bs - 10, by + 22], fill=AMBER)
d.text((bx + bs + 28, by - 4), "Renewly — User Flow", font=F_TITLE, fill=SLATE)
d.text((bx + bs + 28, by + 58), "UPI-first subscription tracker · clickable prototype · 360×800 · light + dark", font=F_TAG, fill=SUB)

# ---- rows ----
y = HEADER_H
for section, tw, th, tokens in ROWS:
    # section label with teal tick
    d.rounded_rectangle([MARGIN, y + 4, MARGIN + 8, y + 34], 4, fill=TEAL)
    d.text((MARGIN + 24, y), section, font=F_SECTION, fill=SLATE)
    y += SECTION_H
    x = MARGIN
    mid_y = y + th // 2
    for t in tokens:
        if t[0] == "img":
            fp = os.path.join(SRC, t[1])
            thumb = rounded_thumb(fp, tw, th)
            # shadow
            d.rounded_rectangle([x + 6, y + 10, x + tw + 6, y + th + 10], CORNER, fill=SHADOW)
            board.paste(thumb, (x, y), thumb)
            d.rounded_rectangle([x, y, x + tw - 1, y + th - 1], CORNER, outline=CARD_BORDER, width=2)
            cap = t[2]
            cw = d.textlength(cap, font=F_CAP)
            d.text((x + (tw - cw) / 2, y + th + 14), cap, font=F_CAP, fill=SLATE)
            x += tw
        elif t[0] == "arrow":
            draw_arrow(d, x, x + ARROW_W, mid_y, t[1])
            x += ARROW_W
        elif t[0] == "gap":
            x += GROUP_GAP
        elif t[0] == "note":
            nx = x + 40
            lines = t[1].split("\n")
            lh = 30
            ny = mid_y - lh * len(lines) / 2
            box_w = max(d.textlength(l, font=F_NOTE) for l in lines) + 40
            d.rounded_rectangle([nx, ny - 18, nx + box_w, ny + lh * len(lines) + 14], 12,
                                fill=(230, 244, 242), outline=(15, 118, 110, 120), width=2)
            for i, l in enumerate(lines):
                d.text((nx + 20, ny + i * lh), l, font=F_NOTE, fill=TEAL)
            x += 300
    y += th + CAP_H + ROW_GAP

# footer
d.text((MARGIN, total_h - 56), "Renewly · Know before it renews. · Prototype flow board", font=F_NOTE, fill=SUB)

board.save(OUT, "PNG", optimize=True)
print("saved", OUT, board.size)
