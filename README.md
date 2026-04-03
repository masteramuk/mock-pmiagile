# PMI-Agile (PMI-ACP) Mock Exam Application

A comprehensive, offline-capable web application designed to help practitioners prepare for the PMI-Agile Certified Practitioner (PMI-ACP) exam.

## Features

- **Large Question Pool**: 625 unique, high-quality questions covering all 7 PMI-ACP domains.
- **Customizable Exam Modes**:
    - **Quick Quiz**: 20 randomized questions.
    - **Half Exam**: 60 randomized questions.
    - **Full Mock Exam**: 120 randomized questions.
- **Difficulty Selection**: Filter questions by Easy, Medium, or Hard levels.
- **Real-time Performance Tracking**:
    - Live timer during exams.
    - Trial history with start/end times and durations.
    - Performance analytics (Total trials, average score, and pass rate).
- **Detailed Review**: Post-exam review with correct/wrong indicators and detailed explanations referencing Agile principles.
- **Data Portability**: Export your trial history to JSON and print results for offline study.
- **Responsive Design**: Modern, clean UI that works across devices.

## Project Structure

```text
.
├── data/
│   └── clean/
│       ├── questions-list.json    # Master database of 625 questions
│       ├── archive/               # Original question batch files
│       └── result/                # Default folder for exported results
├── index.html                     # Main application structure
├── style.css                      # Application styling and print layouts
├── app.js                         # Core logic, state management, and history migration
├── README.md                      # Project overview
├── HOWTORUN.md                    # Installation and usage instructions
└── LICENSE                        # GNU General Public License v3.0
```

## Questions Metadata
Each question in the database includes:
- **Domain**: One of the 7 PMI-ACP domains.
- **Difficulty**: Easy, Medium, or Hard.
- **Explanation**: Detailed rationale behind the correct answer.

## License & Copyright
Copyright (c) 2026 Haszeli Ahmad.
Licensed under the [GNU General Public License v3.0](LICENSE).
