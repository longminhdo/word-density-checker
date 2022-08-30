import { Button, Form, Input } from 'antd';
import { useState } from 'react';
import './HtmlAnalysis.scss';

type Props = {};

const { Item } = Form;

const he = require('he');

function nonAccentVietnamese(str: string) {
  str = str.toLowerCase();
  //     We can also use this instead of from line 11 to line 17
  //     str = str.replace(/\u00E0|\u00E1|\u1EA1|\u1EA3|\u00E3|\u00E2|\u1EA7|\u1EA5|\u1EAD|\u1EA9|\u1EAB|\u0103|\u1EB1|\u1EAF|\u1EB7|\u1EB3|\u1EB5/g, "a");
  //     str = str.replace(/\u00E8|\u00E9|\u1EB9|\u1EBB|\u1EBD|\u00EA|\u1EC1|\u1EBF|\u1EC7|\u1EC3|\u1EC5/g, "e");
  //     str = str.replace(/\u00EC|\u00ED|\u1ECB|\u1EC9|\u0129/g, "i");
  //     str = str.replace(/\u00F2|\u00F3|\u1ECD|\u1ECF|\u00F5|\u00F4|\u1ED3|\u1ED1|\u1ED9|\u1ED5|\u1ED7|\u01A1|\u1EDD|\u1EDB|\u1EE3|\u1EDF|\u1EE1/g, "o");
  //     str = str.replace(/\u00F9|\u00FA|\u1EE5|\u1EE7|\u0169|\u01B0|\u1EEB|\u1EE9|\u1EF1|\u1EED|\u1EEF/g, "u");
  //     str = str.replace(/\u1EF3|\u00FD|\u1EF5|\u1EF7|\u1EF9/g, "y");
  //     str = str.replace(/\u0111/g, "d");
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  // Some system encode vietnamese combining accent as individual utf-8 characters
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // Huyền sắc hỏi ngã nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ''); // Â, Ê, Ă, Ơ, Ư
  str = str.replaceAll('-', ' ');
  str = str.replace(/\s\s+/g, ' ');
  str = str.replaceAll(' ', '-');
  return str;
}

function getAllIndices(str: string) {
  const indices = [];
  for (let i = 0; i < str.length; i++) {
    if (
      `${str[i]}${str[i + 1]}${str[i + 2]}` === '<h1' ||
      `${str[i]}${str[i + 1]}${str[i + 2]}` === '<h2' ||
      `${str[i]}${str[i + 1]}${str[i + 2]}` === '<h3'
    ) {
      indices.push(i);
    }
  }
  return indices;
}

function addStr(str: string, index: number, stringToAdd: string) {
  return (
    str.substring(0, index) + stringToAdd + str.substring(index, str.length)
  );
}

const addIdToHeadingTags = (html: string, menuObject: any) => {
  const indArr = [...getAllIndices(html)]; // O(n)
  let count = 0;

  //~ 0(1) same reason
  for (let i = 0; i < indArr.length; i++) {
    let str = ``;

    html = addStr(html, indArr[i] + 3 + count, ` id='${menuObject[i].id}' `); //take out index => O(1)
    str = ` id='${menuObject[i].id}' `;
    count += str.length;
  }
};

const getStyles = (tag: string) => {
  if (tag === 'h1') {
    return 'font-size: 20px';
  }

  if (tag === 'h2') {
    return 'margin-left: 20px; font-size: 16px';
  }

  if (tag === 'h3') {
    return 'margin-left: 40px; font-size: 12px';
  }
};

const HtmlAnalysis = (props: Props) => {
  const [res, setRes] = useState<string>('');
  const getText = (el: string) => {
    let regex = '</?!?(.)[^>]*>';

    let re = new RegExp(regex, 'g');

    return el.replace(re, '').replace(/\n/g, ' ');
  };

  const onFinish = (v: any) => {
    let html = String(v.input);
    const regexp = /<h[1-3][^>]*?>(.*?)<\/h[1-3]>/g;

    const array = [...html.matchAll(regexp)]; //O(n)

    // const niceArray = array.map((el: any) => el[0]);
    // console.log(niceArray);
    const result = array.map((el) => {
      const text = he.decode(getText(el[0])).trim();
      const id = nonAccentVietnamese(text);
      const tag = el[0].slice(1, 3);

      return { text, id, tag };
    }); // ~~O(1) bcz: around 1-10 h1,h2,h3 tags

    let tmp = '';
    result.forEach(
      (el: any) =>
        (tmp += `<${el.tag} style="${getStyles(
          el.tag
        )}"> <span style="font-weight: bold">	&#60;${el.tag.toUpperCase()}&#62;</span> ${
          el.text
        } </${el.tag}> `)
    );

    setRes(tmp);
  };

  return (
    <div className='html-analysis'>
      <Form
        style={{ width: '100%' }}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 24 }}
        layout={'vertical'}
        onFinish={onFinish}
      >
        <Item label='Input' name={'input'} required>
          <Input.TextArea autoSize />
        </Item>

        <Item>
          <Button type='primary' htmlType='submit'>
            Check
          </Button>
        </Item>
      </Form>

      <div dangerouslySetInnerHTML={{ __html: res }} />
    </div>
  );
};

export default HtmlAnalysis;
