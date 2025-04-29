import re
def text_to_markdown(text: str):

  text = re.sub(r"(?<=\d)\.\s*", ". ", text)
  text = re.sub(r":\s*(\d\.)", r":\n\n\1", text)
  text = re.sub(r"(?<=[\n:.])\s*(\d\.)", r"\n\1", text)
  text = re.sub(r"(\d\..*?)(?=\n\d\.)", r"\1\n", text)
  text = re.sub(r"(^|\n)([A-Z][^\n:]{2,}):", r"\1**\2:**", text)
  text = re.sub(r"\n\s*\d\.", r"\n- ", text)
  text = re.sub(r"\n{3,}", "\n\n", text)
  return text.strip()

# text = "A total of nine courses (36 credits) as follows: 1. The German Studies major begins from the point of student’s German language course placement. No course below a student’s language course placement can be counted towards the German Studies major. 2. Students must complete German 301, 302, and 486 (Capstone Project). 3. German 305 taken abroad may be substituted for either 301 or 302, but not both. 4. Additional requirements for concentration: Students may include one German Studies course taught in English or any relevant course with approval of major advisor. Students must complete German 320 or 321. The focus of the “German Language, Literature, and Culture” concentration is the development of advanced language and cultural proficiency and an in-depth critical understanding of the German-speaking world."
# print(text_to_markdown(text))

