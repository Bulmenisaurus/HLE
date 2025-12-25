import pandas as pd
import base64
from typing import Optional


def image_bytes_to_image(b: Optional[bytes]) -> str:
    if b is None:
        return ''
    else:
        return base64.b64encode(b).decode('utf8')

def main():

    # NOTE: downloaded from https://huggingface.co/datasets/cais/hle
    A = pd.read_parquet('test-00000-of-00001.parquet')

    assert list(A.columns) == ['id', 'question', 'image', 'answer', 'answer_type', 'author_name', 'rationale', 'raw_subject', 'category', 'canary', 'image_preview.bytes', 'image_preview.path', 'rationale_image.bytes', 'rationale_image.path']


    A=A.drop('id', axis=1)
    A=A.drop('category', axis=1) # These are categories, but too broad to generally be useful
    A=A.drop('canary', axis=1)
    A=A.drop('image_preview.bytes', axis=1) # Hopefully just a duplicate of `image` (I haven't actually checked)
    A=A.drop('image_preview.path', axis=1) # ?
    A=A.drop('rationale_image.path', axis=1) # ?


   
    # Change the representation of images from repr(bytes(...)) to b64encode(...)
    # This is much more compact and easily consumed by the frontend
    A['rationale_image_b64'] = A['rationale_image.bytes'].apply(image_bytes_to_image)
    A=A.drop('rationale_image.bytes', axis=1)

    print(A)
    N = A.sample(n=10,random_state=0)

    N.to_csv('./random-sample.csv')

main()