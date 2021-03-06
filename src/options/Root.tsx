import React, { useState, useMemo } from 'react';
import styled from 'styled-components';

import GlobalStyle from './GlobalStyle';

// const ENDPOINT_HOST = 'https://frozen-sands-16144.herokuapp.com';
const ENDPOINT_HOST = 'http://127.0.0.1:5000';

const Endpoint = {
  playground: `${ENDPOINT_HOST}/api/playground`,
  questions: `${ENDPOINT_HOST}/api/questions`,
  summary: `${ENDPOINT_HOST}/api/summary`,
};

const textareaPlaceholder = 
`Live coverage of the rendezvous and docking aired on NASA television and the agency\'s website, with the next highlight due at about 8:30 a.m. Eastern with the hatch opening. It’s been a big weekend for commercial spaceflight. Tourists flocked to the Kennedy Space Center in Florida to watch the launch of the Falcon 9 rocket at 2:49 a.m. Saturday. President Donald Trump congratulated SpaceX in a tweet Saturday afternoon.

The inaugural flight, known as Demo-1, is an important mission designed to test the end-to-end capabilities of the new system, NASA said. It paves the way for Demo-2, a test flight with a crew to carry NASA astronauts Bob Behnken and Doug Hurley to the ISS. That flight is currently slated for July.

Crew Dragon will remain connected to the space station for five days, and will depart on Friday. The mission will not be complete until the spacecraft safely departs from the station and deploys parachutes as part of its splashdown in the Atlantic Ocean.

In 2014, NASA awarded SpaceX and Boeing combined contracts worth as much as $6.8 billion to fly U.S. astronauts to the space station. The agency chose two companies for the unique public-private partnership to assure safe, reliable and cost-effective access to space while avoiding the perils of one provider having a monopoly. The U.S. government is also eager to have the ability to fly to the ISS without buying seats on Russian Soyuz capsules.`;

const StyledRoot = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const Wrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  padding-top: 50px;
  width: 705px;
`;

const Logo = styled.div`
  background-image: url('/assets/images/favicon-192.png');
  background-size: 42px;
  height: 42px;
  width: 42px;
`;

const Title = styled.p`
  font-size: 24px;
  font-weight: bold;
`;

const Subtitle = styled.p`
  font-size: 16px;
`;

const Textarea = styled.textarea`
  border: 1px solid #a2a2a2;
  border-radius: 3px;
  display: block;
  font-size: 13px;
  height: 250px;
  margin: 20px 0 10px;
  outline: none;
  padding: 6px 7px;
  resize: none;
  width: 100%;
`;

const ButtonGroup = styled.div`
  align-items: center;
  display: flex;
`;

const Button = styled.p`
  cursor: pointer;
  font-size: 16px;
  outline: none;
  text-decoration: underline;

  &:hover {
    color: #2828bd;
  }
`;

const Status = styled.p`
  color: gray;
  font-size: 12px;
  font-style: italic;
  margin-left: 22px;
`;

const ResultGroup = styled.div`
  color: #545454;
  display: flex;
  justify-content: space-between;
  margin-top: 32px;
  width: 100%;

  > div {
    width: 48%;
  }
`;

const ResultBox = styled.div`
  background-color: #f7f7f7;
  border-radius: 3px;
  font-size: 13px;
  height: 170px;
  margin-top: 9px;
  overflow-y: scroll;
  padding: 5px 6px;

  > div {
    margin-bottom: 7px;
    > span:first-child {
      font-weight: bold;
    }
  }
`;

const Result = ({
  title,
  label,
}) => {
  return (
    <div>
      <div>{title}</div>
      <ResultBox>{label}</ResultBox>
    </div>
  );
};

const QuestionResult = ({
  question,
  title,
}) => {
  return (
    <div>
      <div>{title}</div>
      <ResultBox>
        <div>
          <span>Questions: </span>
          <span>{question.questions}</span>
        </div>
        <div>
          <span>Answers: </span>
          <span>{question.answers}</span>
        </div>
      </ResultBox>
    </div>
  );
};

const Credit = styled.div`
  color: gray;
  margin-top: 20px;

  span {
    margin-right: 22px;
    
  }

  a {
    color: black;
    text-decoration: none;
  }
`;

const Root = () => {
  const [ fetchStatus, setFetchStatus ] = useState('');
  const [ text, setText ] = useState(textareaPlaceholder);
  const [ summary, setSummary ] = useState('[summary]');
  const [ question, setQuestion ] = useState({
    questions: '[question]',
    answers: '[answers]',
  });

  const handleClickConvert = useMemo(
    () => (e) => {
      setFetchStatus('Data is being fetched...');
      const p1 = postData(Endpoint.summary, {
        text,
      });

      const p2 = postData(Endpoint.playground, {
        text,
        noqs: 3,
      });

      Promise.all([ p1, p2 ])
        .then(([ summaryRes, questionRes ]) => {
          setFetchStatus('Data is successfully fetched');

          setSummary(summaryRes['summary']);
          setQuestion(questionRes);
        });
    },
    [summary],
  );

  const handleChangeTextarea = useMemo(
    () => (e) => {
      setText(e.target.value);
    },
    [text],
  );

  return (
    <StyledRoot>
      <GlobalStyle />
      <Wrapper>
        <Logo />
        <Title>
          Interrobang - Playground
        </Title>
        <Subtitle>
          A new way of consuming information: Get questions in advance to better decide what to learn
        </Subtitle>
        <Textarea
          onChange={handleChangeTextarea}
        >
          {text}
        </Textarea>
        <ButtonGroup>
          <Button onClick={handleClickConvert}>convert</Button>
          <Status>{fetchStatus}</Status>
        </ButtonGroup>
        <ResultGroup>
          <Result
            label={summary}
            title={'Summary'}
          />
          <QuestionResult 
            question={question}
            title={'Questions'}
          />
        </ResultGroup>
        <Credit>
          <div>
            <span>2019 Interrobang presents (last updated Mar 2019)</span>
            <span><a href="https://github.com/interrobang-org">Github</a></span>
          </div>
        </Credit>
      </Wrapper>
    </StyledRoot>
  );
};

export default Root;

function postData(endpoint, data) {
  return fetch(endpoint, {
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
    method: 'POST',
    mode: 'cors',
  })
    .then((response) => {
      console.log('postData() success: %o', response);
      return response.json();
    });
}
