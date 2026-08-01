import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

const apiBaseUrl = String.fromEnvironment(
  'API_BASE_URL',
  defaultValue: 'http://localhost:3000',
);

class InstituteConfig {
  final String type, label, groupLabel, scheduleLabel, assessmentLabel, progressLabel;
  final List<String> modules;

  InstituteConfig({
    required this.type,
    required this.label,
    required this.groupLabel,
    required this.scheduleLabel,
    required this.assessmentLabel,
    required this.progressLabel,
    required this.modules,
  });

  factory InstituteConfig.fromJson(Map<String, dynamic> j) => InstituteConfig(
    type: j['instituteType'] ?? 'SCHOOL',
    label: j['label'] ?? 'Education Institute',
    groupLabel: j['groupLabel'] ?? 'Class / Batch',
    scheduleLabel: j['scheduleLabel'] ?? 'Schedule',
    assessmentLabel: j['assessmentLabel'] ?? 'Assessment',
    progressLabel: j['progressLabel'] ?? 'Learning Progress',
    modules: List<String>.from(j['modules'] ?? const []),
  );
}

Future<InstituteConfig> loadConfig(String schoolId, String token) async {
  final r = await http.get(
    Uri.parse('$apiBaseUrl/schools/$schoolId/ui-config'),
    headers: {'Authorization': 'Bearer $token'},
  );
  if (r.statusCode < 200 || r.statusCode >= 300) {
    throw Exception('Unable to load institute configuration (${r.statusCode})');
  }
  return InstituteConfig.fromJson(jsonDecode(r.body));
}

void main() => runApp(const EduAttendApp());

class EduAttendApp extends StatelessWidget {
  const EduAttendApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'EduAttend',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF1565C0)),
        useMaterial3: true,
      ),
      home: const DemoDashboard(),
    );
  }
}

class DemoDashboard extends StatefulWidget {
  const DemoDashboard({super.key});
  @override
  State<DemoDashboard> createState() => _DemoDashboardState();
}

class _DemoDashboardState extends State<DemoDashboard> {
  InstituteConfig config = InstituteConfig(
    type: 'SCHOOL',
    label: 'School',
    groupLabel: 'Class & Section',
    scheduleLabel: 'Timetable',
    assessmentLabel: 'Exams & Marks',
    progressLabel: 'Academic Progress',
    modules: const ['students','teachers','attendance','fees','notifications','reports','classes','sections','homework','exams'],
  );

  final types = const [
    ['SCHOOL','School'],
    ['COLLEGE_UNIVERSITY','College / University'],
    ['COACHING','Coaching'],
    ['TUITION','Tuition'],
    ['LANGUAGE_INSTITUTE','English / Language'],
    ['COMPUTER_IT_INSTITUTE','Computer / IT'],
    ['SKILL_TRAINING','Skill / Training'],
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('EduAttend'), actions: [
        PopupMenuButton<String>(
          tooltip: 'Demo institute type',
          onSelected: (type) => setState(() {
            final row = types.firstWhere((x) => x[0] == type);
            config = InstituteConfig(
              type: type, label: row[1], groupLabel: type == 'COLLEGE_UNIVERSITY' ? 'Department & Semester' : 'Class / Batch',
              scheduleLabel: type == 'COMPUTER_IT_INSTITUTE' ? 'Lab / Class Schedule' : 'Schedule',
              assessmentLabel: type == 'LANGUAGE_INSTITUTE' ? 'Tests & Results' : 'Exams / Assessments',
              progressLabel: 'Learning Progress', modules: config.modules,
            );
          }),
          itemBuilder: (_) => types.map((x) => PopupMenuItem(value: x[0], child: Text(x[1]))).toList(),
        ),
      ]),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Text('Welcome to ${config.label}', style: Theme.of(context).textTheme.headlineSmall),
          const SizedBox(height: 6),
          Text(config.groupLabel),
          const SizedBox(height: 20),
          Wrap(spacing: 12, runSpacing: 12, children: [
            _card('Students', Icons.people),
            _card('Attendance', Icons.check_circle),
            _card('Fees', Icons.payments),
            _card('Reports', Icons.bar_chart),
          ]),
          const SizedBox(height: 24),
          Text('Modules', style: Theme.of(context).textTheme.titleLarge),
          const SizedBox(height: 8),
          ...config.modules.map((m) => Card(
            child: ListTile(
              leading: const Icon(Icons.arrow_forward),
              title: Text(_title(m)),
              subtitle: m == 'attendance' ? const Text('Mark and view attendance') : null,
            ),
          )),
        ],
      ),
    );
  }

  Widget _card(String title, IconData icon) => SizedBox(
    width: 160, height: 105,
    child: Card(child: Padding(
      padding: const EdgeInsets.all(16),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Icon(icon), const Spacer(), Text(title),
      ]),
    )),
  );

  String _title(String s) => s.replaceAll('_', ' ').split(' ').map((w) => w.isEmpty ? w : '${w[0].toUpperCase()}${w.substring(1)}').join(' ');
}
