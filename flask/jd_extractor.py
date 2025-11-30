import spacy
from spacy.matcher import Matcher

nlp = spacy.load("en_core_web_sm")
text = """We are looking for a passionate and motivated Web Developer to join our team and assist in building engaging and user-friendly web applications. As a Web Developer, you'll gain hands-on experience in real-world web development projects, learn from experienced developers, and enhance your technical and problem-solving skills.

Key Responsibilities:

Assist in developing, testing, and maintaining web applications using HTML, CSS, JavaScript, and modern frameworks.
Collaborate with designers and back-end developers to implement responsive UI/UX.
Help identify and troubleshoot website issues or bugs.
Write clean, efficient, and well-documented code.
Participate in team meetings, brainstorming sessions, and code reviews.
Stay updated with the latest web technologies and trends.
Requirements:

Recently completed a degree in Computer Science, IT, or a related field.
Basic knowledge of HTML, CSS, JavaScript, and any front-end frameworks (e.g., React, Vue, Angular).
Familiarity with version control systems (e.g., Git).
Understanding of responsive design principles.
Good problem-solving and communication skills.
Job Types: Full-time, Permanent, Fresher

Pay: ₹10,000.00 - ₹50,000.00 per month

Work Location: In person"""
doc = nlp(text)

matcher = Matcher(nlp.vocab)
pattern = [{"TEXT": {"REGEX": "₹[0-9,]+\\.?[0-9]*"}}]
matcher.add("SALARY", [pattern])
matches = matcher(doc)

for match_id, start, end in matches:
    print("Salary:", doc[start:end].text)
