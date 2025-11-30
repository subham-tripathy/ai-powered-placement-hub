import pdfplumber
import re
import spacy
from spacy.matcher import PhraseMatcher

nlp = spacy.load("en_core_web_sm")

# custom skills array
CUSTOM_SKILLS = [
    "python", "java", "javascript", "react js", "next js", "node js",
    "mysql", "mongodb", "postgresql", "flask", "dot net", "git", "github",
    "html", "css", "bootstrap", "express js", "django", "typescript"
]

# pdf parser
def pdf_parser(pdf_url):
    t = ""
    pdf = pdfplumber.open(pdf_url)
    for page in pdf.pages:
        t += page.extract_text().replace("●", " ").replace("\n", " ").strip()
    return t

# contact info extractor
def extract_contact_info(text):
    email = re.findall(r'[\w\.-]+@[\w\.-]+', text)
    phone = re.findall(r'(?:\+91[\-\s]?|0)?[6-9]\d{9}', text)
    return {"email": email, "phone": phone}






def parser(url: str):
    if "pdf" in url:
        return pdf_parser(url)
    return ""

text = ""
text = parser("resume7.pdf")
contact_info = extract_contact_info(text)



matcher = PhraseMatcher(nlp.vocab, attr="LOWER")
patterns = [nlp.make_doc(skill) for skill in CUSTOM_SKILLS]
matcher.add("TECH_SKILLS", patterns)
doc = nlp(text)
matches = matcher(doc)

skills = set()
for match_id, start, end in matches:
    span = doc[start:end]
    skills.add(span.text.lower().strip())

print(text)
print()
print()
print()
print()
print()
print("contact info:")
print(contact_info)
print()
print()
print()
print()
print()
print("Skills:")
print(skills)