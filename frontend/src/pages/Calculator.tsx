import React, { useState, useRef, useEffect } from 'react'
import styled from '@emotion/styled'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const BG_COLOR = '#527e66'
const POINT_COLOR = '#21c97a'
const CHECK_ICON = (
  <svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="#21c97a">
    <path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Z"/>
  </svg>
)
const NEXT_ICON = (
  <svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="#fff">
    <path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z"/>
  </svg>
)

const CalculatorContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: ${BG_COLOR};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
`

const SlideWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`

const Slide = styled(motion.div)`
  min-width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 0;
  top: 0;
  background: transparent;
  transition: box-shadow 0.2s;
`

const FormTitle = styled.h2`
  color: #F8F7F3;
  font-size: 2.2rem;
  margin-bottom: 2rem;
  font-weight: 700;
  font-family: 'IBM Plex Sans KR', sans-serif;
`

const InputRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;
  margin-bottom: 1.5rem;
`

const UnitText = styled.span`
  font-size: 1.1rem;
  color: #F8F7F3;
  margin-left: 0.5rem;
`

const FormInput = styled.input`
  font-size: 1.3rem;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  border: none;
  outline: none;
  background: #f8f7f3;
  color: #222;
  margin-bottom: 1.5rem;
  width: 320px;
  max-width: 80vw;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  font-family: 'Pretendard', sans-serif;

  &:focus {
    box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  }
`

const FormSelect = styled.select`
  font-size: 1.3rem;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  border: none;
  outline: none;
  background: #f8f7f3;
  color: #222;
  margin-bottom: 1.5rem;
  width: 320px;
  max-width: 80vw;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  font-family: 'Pretendard', sans-serif;
  cursor: pointer;

  &:focus {
    box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  }
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
  width: 320px;
  max-width: 80vw;
`

const FormLabel = styled.label`
  font-size: 1.1rem;
  color: #F8F7F3;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Pretendard', sans-serif;
`

const FormCheckbox = styled.input`
  width: 1.2rem;
  height: 1.2rem;
  margin-right: 0.5rem;
  cursor: pointer;
`

const TooltipIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.2rem;
  height: 1.2rem;
  border-radius: 50%;
  background: #F8F7F3;
  color: #666;
  font-size: 0.8rem;
  cursor: help;
  margin-left: 0.3rem;
`

const TooltipContent = styled.div`
  position: absolute;
  background: #333;
  color: white;
  padding: 0.8rem;
  border-radius: 8px;
  font-size: 0.9rem;
  max-width: 250px;
  z-index: 1000;
  font-family: 'Pretendard', sans-serif;
`

const DynamicFormItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f8f7f3;
  border-radius: 12px;
  width: 320px;
  max-width: 80vw;
`

const AddButton = styled.button`
  background: #F8F7F3;
  color: #222;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  font-family: 'Pretendard', sans-serif;
  margin-top: 1rem;

  &:hover {
    background: #e8e7e3;
  }
`

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #ff4444;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0.5rem;
`

const PrevNextButtonRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.2rem;
  margin-top: 2rem;
`

const CircleButton = styled.button`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
`

const PrevButton = styled(CircleButton)`
  background: transparent;
  color: #F8F7F3;
  border: 2px solid #b0b0b0;
  &:hover:enabled {
    background: #b0b0b0;
    color: #222;
  }
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`

const NextButton = styled(CircleButton)`
  background: #f69516;
  color: #F8F7F3;
  &:hover {
    background: #d17d0c;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const VerticalProgressWrap = styled.div`
  position: absolute;
  top: 50%;
  left: 2.5vw;
  transform: translateY(-50%);
  display: flex;
  flex-direction: row;
  align-items: center;
  z-index: 20;
  height: 42vh;
  min-height: 280px;
  max-height: 490px;
`

const VerticalBarBg = styled.div`
  width: 10px;
  height: 180%;
  background: rgb(198, 198, 198);
  border-radius: 0.2px;
  position: relative;
  overflow: hidden;
  margin-right: 0.84rem;
`

const VerticalBarFill = styled.div<{ percent: number }>`
  width: 100%;
  height: ${props => props.percent}%;
  background: #f69516;
  border-radius: 0.2px;
  position: absolute;
  top: 0;
  left: 0;
  transition: height 0.3s;
`

const VerticalStepList = styled.ul`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 0.525rem;
  margin: 0;
  padding: 0;
  list-style: none;
  height: auto;
`

const VerticalStepItem = styled.li<{ active: boolean; done: boolean; unknown: boolean; clickable: boolean; required?: boolean }>`
  font-size: 1.05rem;
  font-weight: 700;
  color: ${props =>
    props.unknown ? '#b0b0b0' :
    props.done ? '#444' :
    props.active ? '#f69516' : '#F8F7F3'};
  opacity: 1;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  min-width: 80px;
  transition: color 0.2s, font-weight 0.2s;
  white-space: nowrap;
  cursor: ${props => props.clickable ? 'pointer' : 'default'};
  user-select: none;
  font-family: 'Pretendard', sans-serif;
  &:hover {
    text-decoration: ${props => props.clickable ? 'underline' : 'none'};
  }
`

const UnknownButton = styled.button`
  background: #b0b0b0;
  color: #222;
  border: none;
  border-radius: 50px;
  padding: 0.9rem 2.2rem;
  font-size: 1.2rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  margin-right: 1rem;
  transition: background 0.2s, opacity 0.2s;
  font-family: 'Pretendard', sans-serif;
  &:hover {
    background: #a0a0a0;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const REQUIRED_KEYS = ['birthDate', 'job']

const RequiredAsterisk = styled.span`
  color: #f69516;
  margin-left: 0.3rem;
  font-size: 1.2em;
  vertical-align: middle;
`

const ConfirmTable = styled.table`
  width: 100%;
  max-width: 420px;
  margin: 2rem auto 2.5rem auto;
  border-collapse: collapse;
  background: #f8f7f3;
  border-radius: 16px;
  overflow: hidden;
  font-size: 1.1rem;
  color: #222;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
`

const ConfirmTr = styled.tr`
  border-bottom: 1px solid #eee;
`

const ConfirmTh = styled.th`
  text-align: left;
  padding: 0.7rem 1.2rem;
  background: #f3e9d7;
  font-weight: 700;
  width: 40%;
  font-family: 'IBM Plex Sans KR', sans-serif;
`

const ConfirmTd = styled.td`
  padding: 0.7rem 1.2rem;
  background: #f8f7f3;
  width: 60%;
  font-family: 'Pretendard', sans-serif;
`

const ConfirmMissing = () => (
  <span style={{ color: '#d94a38', fontWeight: 500, fontSize: '1.05em' }}>미입력</span>
)

interface FormData {
  name: string;
  birthDate: string;
  gender: 'male' | 'female';
  residence: string;
  insuranceLevel: number;
  height: number;
  weight: number;
  smokingStatus: 'none' | 'former' | 'current';
  bloodPressure: 'normal' | 'mild' | 'severe';
  diabetes: 'normal' | 'prediabetes' | 'diabetes' | 'severe';
  alcohol: 'none' | 'moderate' | 'heavy';
  exercise: 'regular' | 'occasional' | 'none';
  lifeExpectancy: number;
  job: string;
  asset: number;
  otherPensions: string[];
  firstJoin: string;
  lastLoss: string;
  incomeGrowth: number;
  income: number;
  additionalIncome: Array<{
    type: string;
    amount: number;
  }>;
  dependents: {
    spouse: boolean;
    children: number;
    parents: number;
  };
  credits: {
    military: number;
    childbirth: number;
    unemployment: number;
  };
  retirementIncome: Array<{
    type: string;
    amount: number;
    duration: number;
  }>;
  healthInsurance: string;
  confirm?: boolean;
}

interface NestedField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'month' | 'select' | 'checkbox';
  unit?: string;
  tooltip?: string;
  options?: string[];
  placeholder?: string;
}

interface FormField {
  label: string;
  type: 'text' | 'number' | 'date' | 'month' | 'select' | 'group' | 'dynamic' | 'confirm';
  key: keyof FormData;
  placeholder?: string;
  required?: boolean;
  optional?: boolean;
  options?: { value: string | number; label: string }[];
  fields?: NestedField[];
  tooltip?: string;
  addButtonText?: string;
  unit?: string;
}

const RESIDENCE_OPTIONS = [
  '서울특별시', '부산광역시', '대구광역시', '인천광역시', '광주광역시',
  '대전광역시', '울산광역시', '세종특별자치시', '경기도', '충청북도',
  '충청남도', '전라북도', '전라남도', '경상북도', '경상남도', '제주특별자치도'
];

const INSURANCE_LEVELS = [
  '보험료 1~2 분위',
  '보험료 3~4 분위',
  '보험료 5~6 분위',
  '보험료 7~8 분위',
  '보험료 9~10 분위'
];

const JOB_OPTIONS = [
  '직장인', '자영업자', '공무원', '군인', '프리랜서',
  '학생', '주부', '무직', '은퇴자', '기타'
];

const OTHER_PENSION_OPTIONS = [
  '공무원연금', '사학연금', '군인연금', '퇴직연금', '개인연금', '없음'
];

const HEALTH_INSURANCE_OPTIONS = [
  '직장가입자', '지역가입자', '피부양자'
];

const formList: FormField[] = [
  { 
    label: '닉네임', 
    type: 'text', 
    key: 'name',
    placeholder: '실명이 아니어도 괜찮습니다',
    required: true
  },
  { 
    label: '생년월일', 
    type: 'date', 
    key: 'birthDate',
    required: true
  },
  {
    label: '성별',
    type: 'select',
    key: 'gender',
    options: [
      { value: 'male', label: '남성' },
      { value: 'female', label: '여성' }
    ],
    required: true
  },
  {
    label: '거주지',
    type: 'select',
    key: 'residence',
    options: RESIDENCE_OPTIONS.map(region => ({ value: region, label: region })),
    required: true
  },
  {
    label: '보험료 분위',
    type: 'select',
    key: 'insuranceLevel',
    options: INSURANCE_LEVELS.map((level, index) => ({ value: index + 1, label: level })),
    required: true
  },
  {
    label: '키',
    type: 'number',
    key: 'height',
    placeholder: '예: 170',
    tooltip: 'BMI는 체질량지수로, 비만 관련 질환 위험도를 반영하기 위해 사용됩니다.'
  },
  {
    label: '몸무게',
    type: 'number',
    key: 'weight',
    placeholder: '예: 65',
    tooltip: 'BMI는 체질량지수로, 비만 관련 질환 위험도를 반영하기 위해 사용됩니다.'
  },
  {
    label: '흡연 여부',
    type: 'select',
    key: 'smokingStatus',
    options: [
      { value: 'none', label: '비흡연자' },
      { value: 'former', label: '과거 흡연자 (현재는 금연 중, 5년 이상)' },
      { value: 'current', label: '현재 흡연자 (하루 1갑 이상, 20년 이상)' }
    ],
    tooltip: '흡연은 폐 질환과 심혈관계 질환 위험을 증가시켜 수명에 큰 영향을 줍니다.'
  },
  {
    label: '혈압 상태',
    type: 'select',
    key: 'bloodPressure',
    options: [
      { value: 'normal', label: '정상 (수축기 혈압 < 140mmHg)' },
      { value: 'mild', label: '경도 고혈압 (140–159mmHg)' },
      { value: 'severe', label: '중증 고혈압 (160mmHg 이상)' }
    ],
    tooltip: '혈압이 높을수록 뇌졸중, 심장질환 등의 위험이 증가합니다.'
  },
  {
    label: '당뇨 상태',
    type: 'select',
    key: 'diabetes',
    options: [
      { value: 'normal', label: '정상 (≤5.6%)' },
      { value: 'prediabetes', label: '전당뇨 (5.7–6.4%)' },
      { value: 'diabetes', label: '진단받은 당뇨 (6.5–7.9%)' },
      { value: 'severe', label: '고위험 당뇨 (≥8.0%)' }
    ],
    tooltip: '혈당이 높을수록 장기 손상과 합병증 위험이 커져 수명이 줄어듭니다.'
  },
  {
    label: '음주 빈도',
    type: 'select',
    key: 'alcohol',
    options: [
      { value: 'none', label: '음주 안 함' },
      { value: 'moderate', label: '보통 음주 (주 1,2 회)' },
      { value: 'heavy', label: '고위험 음주 (주 3회 이상)' }
    ],
    tooltip: '고위험 음주는 간질환, 고혈압, 사고 위험을 증가시킵니다.'
  },
  {
    label: '운동 빈도',
    type: 'select',
    key: 'exercise',
    options: [
      { value: 'regular', label: '규칙적인 운동 (주 3회 이상, 회당 30분 이상 유산소)' },
      { value: 'occasional', label: '가끔 운동 (주 1~2회)' },
      { value: 'none', label: '전혀 운동 안 함' }
    ],
    tooltip: '꾸준한 운동은 체중, 혈압, 당뇨 조절에 도움이 되어 기대수명을 연장시킵니다.'
  },
  {
    label: '직업',
    type: 'select',
    key: 'job',
    options: JOB_OPTIONS.map(job => ({ value: job, label: job })),
    required: true
  },
  { 
    label: '자산', 
    type: 'number', 
    key: 'asset',
    placeholder: '예: 10000',
    unit: '만원',
    required: true
  },
  {
    label: '기타 연금',
    type: 'select',
    key: 'otherPensions',
    options: OTHER_PENSION_OPTIONS.map(pension => ({ value: pension, label: pension })),
    tooltip: '국민연금 외에 받고 있는 연금이 있나요?'
  },
  { 
    label: '국민연금 최초 가입년월', 
    type: 'month', 
    key: 'firstJoin',
    required: true
  },
  { 
    label: '국민연금 상실년월', 
    type: 'month', 
    key: 'lastLoss',
    optional: true,
    tooltip: '해당 기간은 납부 이력에서 제외됩니다'
  },
  { 
    label: '예상 소득 상승률', 
    type: 'number', 
    key: 'incomeGrowth',
    placeholder: '예: 3.0',
    unit: '%',
    required: true
  },
  {
    label: '건강보험 자격',
    type: 'select',
    key: 'healthInsurance',
    options: HEALTH_INSURANCE_OPTIONS.map(option => ({ value: option, label: option })),
    required: true
  },
  { 
    label: '소득 정보', 
    type: 'number', 
    key: 'income',
    placeholder: '예: 5000',
    unit: '만원',
    required: true
  },
  {
    label: '추가 소득',
    type: 'dynamic',
    key: 'additionalIncome',
    fields: [
      { key: 'type', label: '소득 종류', type: 'select', options: ['임대소득', '배당소득', '사업소득', '기타'] },
      { key: 'amount', label: '연간 소득액', type: 'number', unit: '만원' }
    ],
    addButtonText: '+ 추가 소득 추가하기'
  },
  {
    label: '부양가족',
    type: 'group',
    key: 'dependents',
    fields: [
      { key: 'spouse', label: '배우자', type: 'checkbox' },
      { key: 'children', label: '부양 자녀 수', type: 'number' },
      { key: 'parents', label: '부양 부모 수', type: 'number' }
    ]
  },
  {
    label: '크레딧',
    type: 'group',
    key: 'credits',
    fields: [
      { key: 'military', label: '군복무 크레딧', type: 'number', unit: '개월', tooltip: '최대 6개월까지 인정' },
      { key: 'childbirth', label: '출산 크레딧', type: 'number', unit: '개월', tooltip: '둘째 자녀부터 인정, 최대 50개월' },
      { key: 'unemployment', label: '실업 크레딧', type: 'number', unit: '개월', tooltip: '최대 12개월까지 인정' }
    ]
  },
  {
    label: '은퇴 이후 소득',
    type: 'dynamic',
    key: 'retirementIncome',
    fields: [
      { key: 'type', label: '소득 종류', type: 'select', options: ['임대소득', '배당소득', '사업소득', '기타'] },
      { key: 'amount', label: '연간 소득액', type: 'number', unit: '만원' },
      { key: 'duration', label: '지속 기간', type: 'number', unit: '년' }
    ],
    addButtonText: '+ 소득 항목 추가하기'
  },
  { 
    label: '최종 확인', 
    type: 'confirm', 
    key: 'confirm'
  }
];

type FormState = { [key: string]: string }

const PrevIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="#F8F7F3">
    <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/>
  </svg>
)

const SmallCheck = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#21c97a">
    <path d="M20.285 6.709l-11.285 11.291-5.285-5.291 1.414-1.414 3.871 3.877 9.871-9.877z"/>
  </svg>
)

const RedX = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#d94a38">
    <path d="M18.3 5.71L12 12l6.3 6.29-1.41 1.42L12 13.41l-6.29 6.3-1.42-1.42L10.59 12 4.29 5.71 5.7 4.29 12 10.59l6.29-6.3z"/>
  </svg>
)

const TipMessage = styled.p`
  color: #F8F7F3;
  font-size: 1rem;
  margin: -1rem 0 1.5rem;
  text-align: center;
  max-width: 320px;
  opacity: 0.8;
  font-family: 'Pretendard', sans-serif;
`

const ErrorMessage = styled.div`
  color: #ff4444;
  font-size: 0.9rem;
  margin-top: -1rem;
  margin-bottom: 1rem;
  text-align: center;
  font-family: 'Pretendard', sans-serif;
`

const renderConfirmValue = (value: any): string => {
  if (Array.isArray(value)) {
    return value.map(v => typeof v === 'object' ? JSON.stringify(v) : v).join(', ');
  }
  if (typeof value === 'object') {
    return Object.entries(value)
      .map(([k, v]) => `${k}: ${v}`)
      .join(', ');
  }
  return String(value);
}

interface DefaultValues {
  birthDate: string;
  height: number;
  weight: number;
  smokingStatus: 'none' | 'former' | 'current';
  bloodPressure: 'normal' | 'mild' | 'severe';
  diabetes: 'normal' | 'prediabetes' | 'diabetes' | 'severe';
  alcohol: 'none' | 'moderate' | 'heavy';
  exercise: 'regular' | 'occasional' | 'none';
  income: number;
  incomeGrowth: number;
}

const getDefaultValuesByGender = (gender: 'male' | 'female'): DefaultValues => {
  const currentYear = new Date().getFullYear();
  const avgAge = gender === 'male' ? 43.7 : 45.9;
  const birthYear = currentYear - avgAge;
  const avgMonthlyIncome = gender === 'male' ? 4260000 : 2790000;

  return {
    birthDate: `${birthYear}-01-01`,
    height: gender === 'male' ? 172 : 158,  // 한국인 평균 신장
    weight: gender === 'male' ? 71 : 57,    // 한국인 평균 체중
    smokingStatus: gender === 'male' ? 'former' : 'none',  // 남성 흡연율 더 높음
    bloodPressure: 'normal',
    diabetes: 'normal',
    alcohol: gender === 'male' ? 'moderate' : 'none',  // 남성 음주율 더 높음
    exercise: 'occasional',
    income: Math.round(avgMonthlyIncome / 10000),  // 만원 단위로 변환
    incomeGrowth: 3.8  // 전년 대비 소득 증가율
  };
};

interface InputStatus {
  touched: boolean;  // 사용자가 입력했거나 "잘 모르겠어요"를 선택한 경우
  value: any;       // 실제 입력값
}

const Calculator = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [form, setForm] = useState<FormData>({
    name: '',
    birthDate: '',
    gender: '' as 'male' | 'female',
    residence: '',
    insuranceLevel: 0,
    height: 0,
    weight: 0,
    smokingStatus: '' as 'none' | 'former' | 'current',
    bloodPressure: '' as 'normal' | 'mild' | 'severe',
    diabetes: '' as 'normal' | 'prediabetes' | 'diabetes' | 'severe',
    alcohol: '' as 'none' | 'moderate' | 'heavy',
    exercise: '' as 'regular' | 'occasional' | 'none',
    lifeExpectancy: 0,
    job: '',
    asset: 0,
    otherPensions: [],
    firstJoin: '',
    lastLoss: '',
    incomeGrowth: 0,
    income: 0,
    additionalIncome: [],
    dependents: {
      spouse: false,
      children: 0,
      parents: 0
    },
    credits: {
      military: 0,
      childbirth: 0,
      unemployment: 0
    },
    retirementIncome: [],
    healthInsurance: ''
  })
  const [inputStatus, setInputStatus] = useState<{ [key: string]: InputStatus }>({})
  const [unknown, setUnknown] = useState<{ [key: string]: boolean }>({})
  const [showTooltip, setShowTooltip] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null);
  // 스크롤 상태 관리 (최상단으로 이동)
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollHeight, setScrollHeight] = useState(1);
  const [clientHeight, setClientHeight] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);

  const calculateAge = (birthDate: string) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    
    return age
  }

  const validateCurrentField = () => {
    const currentField = formList[currentStep];
    if (currentField.required) {
      const value = form[currentField.key];
      if (!value || (Array.isArray(value) && value.length === 0) || value === '') {
        setError('필수 항목입니다. 값을 입력하거나 선택해주세요.');
        return false;
      }
    }
    setError(null);
    return true;
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, key: string) => {
    const value = e.target.value;
    setError(null);  // 입력이 있으면 에러 메시지 제거
    
    setForm(prev => {
      let newForm = { ...prev, [key]: value };
      
      if (key === 'gender' && (value === 'male' || value === 'female')) {
        const defaultValues = getDefaultValuesByGender(value);
        Object.keys(unknown).forEach(unknownKey => {
          if (unknownKey in defaultValues && inputStatus[unknownKey]?.touched) {
            const typedKey = unknownKey as keyof DefaultValues;
            newForm = {
              ...newForm,
              [typedKey]: defaultValues[typedKey]
            };
          }
        });
      }
      
      return newForm as FormData;
    });

    // 입력 상태 업데이트
    setInputStatus(prev => ({
      ...prev,
      [key]: { touched: true, value }
    }));

    setUnknown(prev => ({
      ...prev,
      [key]: false
    }));
  }

  const handleGroupInput = (key: keyof FormData, field: string, value: any) => {
    setForm(prev => {
      const currentValue = prev[key] as { [key: string]: any };
      return {
        ...prev,
        [key]: {
          ...currentValue,
          [field]: value
        }
      };
    });
  };

  const handleDynamicAdd = (key: string) => {
    const defaultValues = {
      additionalIncome: { type: '', amount: 0 },
      retirementIncome: { type: '', amount: 0, duration: 0 }
    }
    
    setForm(prev => ({
      ...prev,
      [key]: [...(prev[key as keyof FormData] as any[]), defaultValues[key as keyof typeof defaultValues]]
    }))
  }

  const handleDynamicRemove = (key: string, index: number) => {
    setForm(prev => ({
      ...prev,
      [key]: (prev[key as keyof FormData] as any[]).filter((_, i) => i !== index)
    }))
  }

  const handleUnknown = () => {
    const currentField = formList[currentStep];
    
    if (currentField.key === 'gender') {
      const randomGender = Math.random() < 0.52 ? 'male' : 'female';
      const defaultValues = getDefaultValuesByGender(randomGender);
      
      setForm(prev => ({
        ...prev,
        gender: randomGender,
        ...defaultValues
      }));

      // 입력 상태 업데이트
      setInputStatus(prev => ({
        ...prev,
        gender: { touched: true, value: randomGender }
      }));
    } else {
      if (form.gender) {
        const defaultValues = getDefaultValuesByGender(form.gender);
        const key = currentField.key as keyof DefaultValues;
        
        if (key in defaultValues) {
          setForm(prev => ({
            ...prev,
            [key]: defaultValues[key]
          }));

          // 입력 상태 업데이트
          setInputStatus(prev => ({
            ...prev,
            [key]: { touched: true, value: defaultValues[key] }
          }));
        }
      }
    }

    setUnknown(prev => ({
      ...prev,
      [currentField.key]: true
    }));

    // 자동으로 다음 단계로 이동
    setTimeout(() => {
      goNext();
    }, 100);
  }

  const goNext = () => {
    const currentField = formList[currentStep];
    
    // 선택형 필드이고 아직 터치되지 않은 경우, 현재 선택된 값을 입력으로 처리
    if (currentField.type === 'select' && !inputStatus[currentField.key]?.touched) {
      const value = form[currentField.key];
      if (value) {  // 기본 선택값이 있는 경우
        setInputStatus(prev => ({
          ...prev,
          [currentField.key]: { touched: true, value }
        }));
      }
    }

    if (!validateCurrentField()) {
      return;
    }

    if (currentStep < formList.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      navigate('/result', { state: form });
    }
  }

  const goPrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      goNext()
    }
  }

  const calculateLifeExpectancy = () => {
    let baseAge = form.gender === 'male' ? 77 : 83;  // 기본 기대수명 (2023년 통계청 기준)
    
    // BMI 영향
    if (form.height && form.weight) {
      const bmi = form.weight / ((form.height / 100) ** 2);
      if (bmi < 18.5) baseAge -= 2;
      else if (bmi > 30) baseAge -= 3;
      else if (bmi > 25) baseAge -= 1;
    }

    // 흡연 상태 영향
    if (form.smokingStatus === 'current') baseAge -= 5;
    else if (form.smokingStatus === 'former') baseAge -= 1;

    // 혈압 상태 영향
    if (form.bloodPressure === 'mild') baseAge -= 2;
    else if (form.bloodPressure === 'severe') baseAge -= 4;

    // 당뇨 상태 영향
    if (form.diabetes === 'prediabetes') baseAge -= 1;
    else if (form.diabetes === 'diabetes') baseAge -= 3;
    else if (form.diabetes === 'severe') baseAge -= 5;

    // 음주 빈도 영향
    if (form.alcohol === 'heavy') baseAge -= 3;
    else if (form.alcohol === 'moderate') baseAge -= 1;

    // 운동 빈도 영향
    if (form.exercise === 'regular') baseAge += 2;
    else if (form.exercise === 'none') baseAge -= 2;

    return Math.round(baseAge);
  };

  useEffect(() => {
    // 건강 관련 필드가 모두 입력되었을 때 예상 수명 계산
    const healthFields = ['height', 'weight', 'smokingStatus', 'bloodPressure', 'diabetes', 'alcohol', 'exercise'];
    const allHealthFieldsFilled = healthFields.every(field => form[field as keyof FormData]);
    
    if (allHealthFieldsFilled) {
      const expectedAge = calculateLifeExpectancy();
      setForm(prev => ({
        ...prev,
        lifeExpectancy: expectedAge
      }));
    }
  }, [form.height, form.weight, form.smokingStatus, form.bloodPressure, form.diabetes, form.alcohol, form.exercise]);

  // confirm 화면에서만 스크롤 상태 갱신
  useEffect(() => {
    if (currentStep === formList.length - 1 && scrollRef.current) {
      setScrollHeight(scrollRef.current.scrollHeight);
      setClientHeight(scrollRef.current.clientHeight);
    }
  }, [form, currentStep]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  const renderFormField = (field: FormField) => {
    const currentField = field;
    
    switch (currentField.type) {
      case 'text':
      case 'number':
      case 'date':
      case 'month':
        return (
          <FormInput
            type={currentField.type}
            value={form[currentField.key as keyof FormData] as string}
            onChange={(e) => handleInput(e, currentField.key)}
            placeholder={currentField.placeholder}
            onKeyDown={handleKeyDown}
          />
        )

      case 'select':
        return (
          <FormSelect
            value={inputStatus[currentField.key]?.touched ? form[currentField.key] as string : ''}
            onChange={(e) => handleInput(e, currentField.key)}
            aria-label={currentField.label}
            title={currentField.label}
          >
            <option value="" disabled>선택해주세요</option>
            {currentField.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </FormSelect>
        )

      case 'group':
        return (
          <FormGroup>
            {currentField.fields?.map((field) => (
              <div key={field.key}>
                <FormLabel>
                  {field.label}
                  {field.tooltip && (
                    <TooltipIcon
                      onMouseEnter={() => setShowTooltip(field.key)}
                      onMouseLeave={() => setShowTooltip(null)}
                    >
                      ?
                    </TooltipIcon>
                  )}
                </FormLabel>
                {field.type === 'checkbox' ? (
                  <FormCheckbox
                    type="checkbox"
                    checked={(form[currentField.key] as any)[field.key]}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      handleGroupInput(currentField.key, field.key, e.target.checked)
                    }
                  />
                ) : (
                  <FormInput
                    type={field.type}
                    value={(form[currentField.key] as any)[field.key]}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      handleGroupInput(currentField.key, field.key, e.target.value)
                    }
                    placeholder={field.placeholder}
                  />
                )}
                {showTooltip === field.key && field.tooltip && (
                  <TooltipContent>{field.tooltip}</TooltipContent>
                )}
              </div>
            ))}
          </FormGroup>
        );

      case 'dynamic':
        return (
          <div>
            {(form[currentField.key] as any[]).map((item, index) => (
              <DynamicFormItem key={index}>
                {currentField.fields?.map((field) => (
                  <div key={field.key}>
                    <FormLabel>{field.label}</FormLabel>
                    {field.type === 'select' ? (
                      <FormSelect
                        value={item[field.key]}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                          const newItems = [...(form[currentField.key] as any[])];
                          newItems[index] = { ...newItems[index], [field.key]: e.target.value };
                          setForm(prev => ({
                            ...prev,
                            [currentField.key]: newItems
                          }));
                        }}
                        aria-label={field.label}
                        title={field.label}
                      >
                        <option value="" disabled>선택해주세요</option>
                        {field.options && field.options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </FormSelect>
                    ) : (
                      <FormInput
                        type={field.type}
                        value={item[field.key]}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const newItems = [...(form[currentField.key] as any[])];
                          newItems[index] = { ...newItems[index], [field.key]: e.target.value };
                          setForm(prev => ({
                            ...prev,
                            [currentField.key]: newItems
                          }));
                        }}
                        placeholder={field.placeholder}
                        aria-label={field.label}
                      />
                    )}
                  </div>
                ))}
                <RemoveButton onClick={() => handleDynamicRemove(currentField.key, index)}>
                  ❌
                </RemoveButton>
              </DynamicFormItem>
            ))}
            <AddButton onClick={() => handleDynamicAdd(currentField.key)}>
              {currentField.addButtonText}
            </AddButton>
          </div>
        );

      case 'confirm': {
        // 스크롤 thumb 계산
        const thumbHeight = Math.max((clientHeight / scrollHeight) * 70 * (window.innerHeight / 100), 40);
        const thumbTop = (scrollTop / scrollHeight) * (clientHeight - thumbHeight);
        return (
          <ConfirmTableWrap>
            <ConfirmTableScrollArea
              ref={scrollRef}
              onScroll={handleScroll}
              style={{ maxHeight: '70vh' }}
            >
              <ConfirmTable>
                <tbody>
                  {formList.slice(0, -1).map((f) => (
                    <ConfirmTr key={f.key}>
                      <ConfirmTh>{f.label}</ConfirmTh>
                      <ConfirmTd>
                        {unknown[f.key] ? (
                          <span>잘 모르겠어요</span>
                        ) : (
                          renderConfirmValue(form[f.key])
                        )}
                      </ConfirmTd>
                    </ConfirmTr>
                  ))}
                </tbody>
              </ConfirmTable>
            </ConfirmTableScrollArea>
            <CustomScrollbar>
              <CustomThumb top={thumbTop || 0} height={thumbHeight || 40} />
            </CustomScrollbar>
          </ConfirmTableWrap>
        )
      }

      default:
        return null
    }
  }

  return (
    <CalculatorContainer>
      <SlideWrapper>
        <Slide
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <FormTitle>
            {formList[currentStep].label}
            {formList[currentStep].required && <RequiredAsterisk>*</RequiredAsterisk>}
          </FormTitle>
          {formList[currentStep].tooltip && (
            <TipMessage>{formList[currentStep].tooltip}</TipMessage>
          )}
          {renderFormField(formList[currentStep])}
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <PrevNextButtonRow>
            <PrevButton onClick={goPrev} disabled={currentStep === 0}>
              <PrevIcon />
            </PrevButton>
            {!formList[currentStep].required && (
              <UnknownButton onClick={handleUnknown}>잘 모르겠어요</UnknownButton>
            )}
            <NextButton onClick={goNext}>
              {currentStep === formList.length - 1 ? '계산하기' : NEXT_ICON}
            </NextButton>
          </PrevNextButtonRow>
        </Slide>
      </SlideWrapper>
      <VerticalProgressWrap>
        <VerticalBarBg>
          <VerticalBarFill 
            percent={
              (formList.filter((_, i) => i < currentStep && inputStatus[formList[i].key]?.touched).length / 
              (formList.length - 1)) * 100
            } 
          />
        </VerticalBarBg>
        <VerticalStepList>
          {formList.map((f, i) => (
            <VerticalStepItem
              key={f.key}
              active={i === currentStep}
              done={inputStatus[f.key]?.touched}
              unknown={!!unknown[f.key]}
              clickable={i < currentStep || inputStatus[f.key]?.touched || (i === formList.length - 1 && Object.keys(form).length === formList.length - 1)}
              required={!!f.required}
              onClick={() => {
                if (i < currentStep || inputStatus[f.key]?.touched || (i === formList.length - 1 && Object.keys(form).length === formList.length - 1)) {
                  setCurrentStep(i)
                }
              }}
            >
              {inputStatus[f.key]?.touched && !unknown[f.key] && <SmallCheck />}
              {unknown[f.key] && <RedX />}
              {f.label}
              {!!f.required && <RequiredAsterisk>*</RequiredAsterisk>}
            </VerticalStepItem>
          ))}
        </VerticalStepList>
      </VerticalProgressWrap>
    </CalculatorContainer>
  )
}

const ConfirmTableWrap = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  max-height: 70vh;
  width: 100%;
  max-width: 420px;
  margin: 2rem auto 2.5rem auto;
  border-radius: 16px;
  background: #f8f7f3;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  position: relative;
`;

const ConfirmTableScrollArea = styled.div`
  max-height: 70vh;
  overflow-y: auto;
  flex: 1 1 auto;
`;

const CustomScrollbar = styled.div`
  width: 10px;
  margin-left: 5px;
  border-radius: 8px;
  background: transparent;
  position: relative;
  height: 70vh;
  display: flex;
  align-items: flex-start;
`;

const CustomThumb = styled.div<{ top: number; height: number }>`
  width: 100%;
  background: #fff;
  border-radius: 8px;
  min-height: 40px;
  position: absolute;
  left: 0;
  top: ${props => props.top}px;
  height: ${props => props.height}px;
  border: 2px solid #f8f7f3;
`;

export default Calculator 