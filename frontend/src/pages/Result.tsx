import React, { useState } from 'react'
import styled from '@emotion/styled'
import { useLocation } from 'react-router-dom'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { Document as DocxDocument, Packer, Paragraph, Table as DocxTable, TableRow, TableCell, WidthType, AlignmentType, HeadingLevel, TextRun } from 'docx'
import { saveAs } from 'file-saver'

// 타입 정의
interface FormData {
  birthDate?: string;
  lifeExpectancy?: number;
  asset?: number;
  firstJoin?: string;
  incomeGrowth?: number;
}

interface SimulationItem {
  개시연령: number;
  월수령액: number;
  총수령액: number;
}

interface BestResult {
  개시연령: number;
  월수령액: number;
  총수령액: number;
}

const Container = styled.div`
  width: 100vw;
  min-height: 100vh;
  background: #527e66;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 60px;
  color: #F8F7F3;
`

const Title = styled.h1`
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-align: center;
`

const Summary = styled.div`
  font-size: 1.3rem;
  font-weight: 500;
  margin-bottom: 2.5rem;
  text-align: center;
`

const ResultSection = styled.section`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  width: 100%;
  max-width: 800px;
`

const ResultMessage = styled.div`
  font-size: 1.5rem;
  line-height: 2;
  margin-bottom: 2rem;
  text-align: left;

  strong {
    color: #21c97a;
    font-weight: 700;
  }
`

const TipMessage = styled.div`
  background: rgba(33, 201, 122, 0.1);
  border-left: 4px solid #21c97a;
  padding: 1rem;
  margin: 1rem 0;
  font-size: 1.1rem;
`

const DownloadButton = styled.button`
  background-color: #21c97a;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #1ba567;
  }
`

// 연금 시뮬레이션 함수 (Python 로직 변환)
function calculatePensionSimulation(basePension: number, expectedLife: number, startAgeRange: number[] = Array.from({length: 11}, (_, i) => 60 + i)) {
  function monthlyAmountByAge(startAge: number): number {
    if (startAge < 65) {
      return basePension * (1 - 0.006 * (65 - startAge) * 12);
    } else if (startAge > 65) {
      return basePension * (1 + 0.072 * (startAge - 65));
    }
    return basePension;
  }

  function totalAmount(monthly: number, startAge: number): number {
    const months = Math.max((expectedLife - startAge) * 12, 0);
    return monthly * months;
  }

  const simulation = startAgeRange.map(age => {
    const monthly = monthlyAmountByAge(age);
    const total = totalAmount(monthly, age);
    return {
      개시연령: age,
      월수령액: Math.round(monthly),
      총수령액: Math.round(total)
    };
  });

  const best = simulation.reduce((a, b) => (a.총수령액 > b.총수령액 ? a : b));
  return { simulation, best };
}

// Word 문서 생성 함수
const createWordDocument = (form: FormData, simulation: SimulationItem[], best: BestResult) => {
  const doc = new DocxDocument({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          text: "연금 예상 결과",
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          spacing: {
            after: 200
          }
        }),
        new Paragraph({
          text: "입력 정보",
          heading: HeadingLevel.HEADING_2,
          spacing: {
            before: 200,
            after: 200
          }
        }),
        new DocxTable({
          width: {
            size: 100,
            type: WidthType.PERCENTAGE,
          },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: {
                    size: 50,
                    type: WidthType.PERCENTAGE,
                  },
                  children: [new Paragraph("생년월일")],
                }),
                new TableCell({
                  width: {
                    size: 50,
                    type: WidthType.PERCENTAGE,
                  },
                  children: [new Paragraph(form.birthDate || "미입력")],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph("예상 수명")],
                }),
                new TableCell({
                  children: [new Paragraph(`${form.lifeExpectancy || 83}세`)],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph("자산")],
                }),
                new TableCell({
                  children: [new Paragraph(`${form.asset?.toLocaleString() || '50,000'}만원`)],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph("첫 가입일")],
                }),
                new TableCell({
                  children: [new Paragraph(form.firstJoin || "2005-03")],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph("소득 증가율")],
                }),
                new TableCell({
                  children: [new Paragraph(`${form.incomeGrowth || '2.5'}%`)],
                }),
              ],
            }),
          ],
        }),
        new Paragraph({
          text: "예상 결과",
          heading: HeadingLevel.HEADING_2,
          spacing: {
            before: 200,
            after: 200
          }
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `최적 개시연령: ${best.개시연령}세`,
              bold: true
            })
          ],
          spacing: {
            after: 100
          }
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `월 예상 수령액: ${best.월수령액.toLocaleString()}만원`,
              bold: true
            })
          ],
          spacing: {
            after: 100
          }
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `총 예상 수령액: ${best.총수령액.toLocaleString()}만원`,
              bold: true
            })
          ],
          spacing: {
            after: 200
          }
        }),
        new Paragraph({
          text: "개시연령별 예상 수령액",
          heading: HeadingLevel.HEADING_2,
          spacing: {
            before: 200,
            after: 200
          }
        }),
        ...simulation.map(item => 
          new Paragraph({
            text: `${item.개시연령}세: 월 ${item.월수령액.toLocaleString()}만원 (총 ${item.총수령액.toLocaleString()}만원)`,
            spacing: {
              after: 100
            }
          })
        ),
      ],
    }],
  });

  return doc;
};

// 수명에 따른 최적 수급 시기 시뮬레이션 함수
function calculateLifeExpectancySimulation(basePension: number, lifeExpectancy: number) {
  const lifeRange = Array.from(
    { length: 21 }, 
    (_, i) => lifeExpectancy - 10 + i
  );

  return lifeRange.map(life => {
    const simulations = Array.from({ length: 11 }, (_, i) => {
      const startAge = 60 + i;
      let monthlyAmount = basePension;
      
      if (startAge < 65) {
        monthlyAmount *= (1 - 0.006 * (65 - startAge) * 12);
      } else if (startAge > 65) {
        monthlyAmount *= (1 + 0.072 * (startAge - 65));
      }

      const totalMonths = Math.max((life - startAge) * 12, 0);
      const totalAmount = monthlyAmount * totalMonths;

      return { startAge, totalAmount };
    });

    const bestOption = simulations.reduce((a, b) => 
      a.totalAmount > b.totalAmount ? a : b
    );

    return {
      예상수명: life,
      최적수급시기: bestOption.startAge,
      총수령액_백만: Math.round(bestOption.totalAmount / 1000000)
    };
  });
}

const Result = () => {
  const location = useLocation();
  const rawForm = location.state || {};
  const form = {
    ...rawForm,
    birthDate: rawForm.birth || '',
    lifeExpectancy: rawForm.lifeExpectancy && rawForm.lifeExpectancy !== '' ? rawForm.lifeExpectancy : 83,
    asset: rawForm.asset && rawForm.asset !== '' ? rawForm.asset : 50000,
    firstJoin: rawForm.firstJoin && rawForm.firstJoin !== '' ? rawForm.firstJoin : '2005-03',
    incomeGrowth: rawForm.incomeGrowth && rawForm.incomeGrowth !== '' ? rawForm.incomeGrowth : 2.5,
  };

  const basePension = 120; // 예시: 120만원
  const expectedLife = Number(form.lifeExpectancy) || 83;
  const { simulation, best } = calculatePensionSimulation(basePension, expectedLife);
  const lifeExpectancyData = calculateLifeExpectancySimulation(basePension, expectedLife);

  // 총수령액(백만원) 단위로 변환
  const simulationWithTotalInHundred = simulation.map(row => ({
    ...row,
    총수령액_백만: Math.round(row.총수령액 / 100),
  }));

  const handleWordDownload = async () => {
    const doc = createWordDocument(form, simulation, best);
    const blob = await Packer.toBlob(doc);
    saveAs(blob, "연금예상결과.docx");
  };

  if (!simulation || simulation.length === 0 || !best) {
    return (
      <Container>
        <Title>연금 예상 결과</Title>
        <Summary>입력 데이터가 없습니다. 처음부터 다시 시도해 주세요.</Summary>
      </Container>
    );
  }

  return (
    <Container>
      <Title>연금 예상 결과</Title>
      
      <ResultSection>
        <ResultMessage>
          {form.name ? `${form.name}님, ` : ''}당신의 <strong>월 예상 연금 수령액은 {best.월수령액}만원</strong>입니다.<br/>
          <strong>만 {best.개시연령}세부터 수령을 시작하면</strong>,<br/>
          예상 수명 <strong>만 {expectedLife}세</strong> 기준으로 <strong>총 {best.총수령액.toLocaleString()}만원</strong>을 수령할 수 있습니다.
        </ResultMessage>

        <TipMessage>
          💡 참고로, <strong>가장 유리한 수급 시기는 만 {best.개시연령}세</strong>입니다.<br/>
          만 {best.개시연령}세에 연금을 개시하면, 현재 설정한 수급 시기보다 총 {(best.총수령액 - simulation[0].총수령액).toLocaleString()}만원 더 받을 수 있습니다.
        </TipMessage>

        <DownloadButton onClick={handleWordDownload}>
          결과 다운로드
        </DownloadButton>
      </ResultSection>

      <ResultSection>
        <h2 style={{ color: '#21c97a', fontSize: '1.4rem', marginBottom: '1.5rem' }}>
          개시연령별 월 수령액 (만원)
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={simulation} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="개시연령" 
              tick={{ fill: '#F8F7F3' }} 
              label={{ value: '개시연령(세)', position: 'insideBottom', offset: -5, fill: '#F8F7F3' }} 
            />
            <YAxis 
              tick={{ fill: '#F8F7F3' }} 
              label={{ value: '월수령액(만원)', angle: -90, position: 'insideLeft', fill: '#F8F7F3' }} 
            />
            <Tooltip 
              formatter={(value) => value.toLocaleString()} 
              contentStyle={{ backgroundColor: '#2A2A2A', border: 'none' }}
              labelStyle={{ color: '#F8F7F3' }}
            />
            <Line 
              type="monotone" 
              dataKey="월수령액" 
              stroke="#21c97a" 
              strokeWidth={3} 
              name="월수령액(만원)" 
              dot={{ r: 4 }} 
              activeDot={{ r: 7 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </ResultSection>

      <ResultSection>
        <h2 style={{ color: '#f69516', fontSize: '1.4rem', marginBottom: '1.5rem' }}>
          개시연령별 총 수령액 (백만원)
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={simulationWithTotalInHundred} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="개시연령" 
              tick={{ fill: '#F8F7F3' }} 
              label={{ value: '개시연령(세)', position: 'insideBottom', offset: -5, fill: '#F8F7F3' }} 
            />
            <YAxis 
              tick={{ fill: '#F8F7F3' }} 
              label={{ value: '총수령액(백만원)', angle: -90, position: 'insideLeft', fill: '#F8F7F3' }} 
            />
            <Tooltip 
              formatter={(value) => value.toLocaleString()} 
              contentStyle={{ backgroundColor: '#2A2A2A', border: 'none' }}
              labelStyle={{ color: '#F8F7F3' }}
            />
            <Line 
              type="monotone" 
              dataKey="총수령액_백만" 
              stroke="#f69516" 
              strokeWidth={3} 
              name="총수령액(백만원)" 
              dot={{ r: 4 }} 
              activeDot={{ r: 7 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </ResultSection>

      <ResultSection>
        <h2 style={{ color: '#F8F7F3', fontSize: '1.4rem', marginBottom: '1rem' }}>
          수명에 따른 최적 수급 시기 시뮬레이션
        </h2>
        <TipMessage>
          💬 건강관리를 꾸준히 한다면 수명은 더 길어질 수 있어요!<br/>
          수명이 길어진다면, <strong>언제 연금을 받는 게 가장 유리할지</strong> 알아보세요.
        </TipMessage>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={lifeExpectancyData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="예상수명" 
              tick={{ fill: '#F8F7F3' }} 
              label={{ value: '예상수명(세)', position: 'insideBottom', offset: -5, fill: '#F8F7F3' }} 
            />
            <YAxis 
              tick={{ fill: '#F8F7F3' }} 
              label={{ value: '총수령액(백만원)', angle: -90, position: 'insideLeft', fill: '#F8F7F3' }} 
            />
            <Tooltip 
              formatter={(value, name) => {
                if (name === '최적수급시기') return `${value}세`;
                return `${value.toLocaleString()}백만원`;
              }}
              contentStyle={{ backgroundColor: '#2A2A2A', border: 'none' }}
              labelStyle={{ color: '#F8F7F3' }}
            />
            <Line 
              type="monotone" 
              dataKey="총수령액_백만" 
              stroke="#21c97a" 
              strokeWidth={3} 
              name="총수령액" 
              dot={{ r: 4 }} 
              activeDot={{ r: 7 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </ResultSection>
    </Container>
  );
};

export default Result 