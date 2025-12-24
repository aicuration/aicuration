from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from database import engine
import sqlalchemy
from datetime import datetime
import uuid
import json
import os
import requests

app = Flask(__name__, static_folder='../frontend/build', static_url_path='')
CORS(app, 
     origins=['http://localhost:5000', 'http://localhost:3000', 'http://172.30.1.14:3000'],
     supports_credentials=True,
     allow_headers=['Content-Type', 'Authorization'],
     methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])

# Google Identity Services를 위한 COOP 헤더 설정
@app.after_request
def set_custom_headers(response):
    # Cross-Origin-Opener-Policy를 unsafe-none으로 설정하여 Google 로그인 팝업 허용
    response.headers['Cross-Origin-Opener-Policy'] = 'unsafe-none'
    response.headers['Cross-Origin-Embedder-Policy'] = 'unsafe-none'
    return response

# 설문조사 응답 저장 API
@app.route('/api/surveys', methods=['POST'])
def save_survey():
    try:
        data = request.get_json()
        
        # 세션 ID 생성 또는 기존 세션 ID 사용
        session_id = data.get('session_id') or str(uuid.uuid4())
        
        # 데이터베이스에 저장 (UPSERT 방식 - 같은 session_id가 있으면 업데이트)
        with engine.connect() as conn:
            # 먼저 같은 session_id가 있는지 확인
            existing = conn.execute(sqlalchemy.text("""
                SELECT id FROM survey_responses WHERE session_id = :session_id
            """), {'session_id': session_id}).fetchone()
            
            if existing:
                # 기존 응답이 있으면 업데이트
                conn.execute(sqlalchemy.text("""
                    UPDATE survey_responses 
                    SET responses = :responses, updated_at = :updated_at
                    WHERE session_id = :session_id
                """), {
                    'responses': json.dumps(data.get('responses', {})),
                    'updated_at': datetime.now(),
                    'session_id': session_id
                })
                message = '설문조사 응답이 성공적으로 업데이트되었습니다.'
            else:
                # 새로운 응답 삽입
                conn.execute(sqlalchemy.text("""
                    INSERT INTO survey_responses (user_id, session_id, responses, created_at, updated_at)
                    VALUES (:user_id, :session_id, :responses, :created_at, :updated_at)
                """), {
                    'user_id': data.get('userId'),
                    'session_id': session_id,
                    'responses': json.dumps(data.get('responses', {})),
                    'created_at': datetime.now(),
                    'updated_at': datetime.now()
                })
                message = '설문조사가 성공적으로 저장되었습니다.'
            
            conn.commit()
        
        return jsonify({
            'success': True,
            'message': message,
            'session_id': session_id,
            'is_update': existing is not None
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'설문조사 저장 실패: {str(e)}'
        }), 500

# 설문조사 통계 조회 API (개발자용)
@app.route('/api/admin/survey-stats', methods=['GET'])
def get_survey_stats():
    try:
        with engine.connect() as conn:
            # 전체 응답 수
            total_responses = conn.execute(sqlalchemy.text("""
                SELECT COUNT(*) FROM survey_responses
            """)).scalar()
            
            # 전체 만족도 분포 (SQLite 문법)
            try:
                satisfaction_stats = conn.execute(sqlalchemy.text("""
                    SELECT 
                        json_extract(responses, '$.overallSatisfaction') as satisfaction_level,
                        COUNT(*) as count
                    FROM survey_responses 
                    WHERE json_extract(responses, '$.overallSatisfaction') IS NOT NULL
                    GROUP BY satisfaction_level
                    ORDER BY satisfaction_level
                """)).fetchall()
            except:
                satisfaction_stats = []
            
            # 상세 평가 통계 (SQLite 문법)
            try:
                design_stats = conn.execute(sqlalchemy.text("""
                    SELECT 
                        json_extract(responses, '$.designRating') as rating,
                        COUNT(*) as count
                    FROM survey_responses 
                    WHERE json_extract(responses, '$.designRating') IS NOT NULL
                    GROUP BY rating
                    ORDER BY count DESC
                """)).fetchall()
            except:
                design_stats = []
            
            try:
                functionality_stats = conn.execute(sqlalchemy.text("""
                    SELECT 
                        json_extract(responses, '$.functionalityRating') as rating,
                        COUNT(*) as count
                    FROM survey_responses 
                    WHERE json_extract(responses, '$.functionalityRating') IS NOT NULL
                    GROUP BY rating
                    ORDER BY count DESC
                """)).fetchall()
            except:
                functionality_stats = []
            
            try:
                content_stats = conn.execute(sqlalchemy.text("""
                    SELECT 
                        json_extract(responses, '$.contentRating') as rating,
                        COUNT(*) as count
                    FROM survey_responses 
                    WHERE json_extract(responses, '$.contentRating') IS NOT NULL
                    GROUP BY rating
                    ORDER BY count DESC
                """)).fetchall()
            except:
                content_stats = []
            
            try:
                navigation_stats = conn.execute(sqlalchemy.text("""
                    SELECT 
                        json_extract(responses, '$.navigationRating') as rating,
                        COUNT(*) as count
                    FROM survey_responses 
                    WHERE json_extract(responses, '$.navigationRating') IS NOT NULL
                    GROUP BY rating
                    ORDER BY count DESC
                """)).fetchall()
            except:
                navigation_stats = []
            
            # 기능 선호도 통계 (SQLite는 배열 처리 제한적)
            # responses JSON에서 favoriteFeatures 배열 추출
            try:
                all_responses = conn.execute(sqlalchemy.text("""
                    SELECT responses FROM survey_responses
                """)).fetchall()
                
                feature_counts = {}
                for row in all_responses:
                    try:
                        responses = json.loads(row[0]) if isinstance(row[0], str) else row[0]
                        favorite_features = responses.get('favoriteFeatures', [])
                        if isinstance(favorite_features, list):
                            for feature in favorite_features:
                                if feature:
                                    feature_counts[feature] = feature_counts.get(feature, 0) + 1
                    except Exception as e:
                        continue
                
                # 상위 5개 인기 기능
                feature_stats = sorted(feature_counts.items(), key=lambda x: x[1], reverse=True)[:5]
            except Exception as e:
                feature_stats = []
            
            # 최근 응답 (최근 10개)
            recent_responses = conn.execute(sqlalchemy.text("""
                SELECT 
                    id,
                    user_id,
                    session_id,
                    responses,
                    created_at
                FROM survey_responses 
                ORDER BY created_at DESC 
                LIMIT 10
            """)).fetchall()
            
            return jsonify({
                'success': True,
                'data': {
                    'total_responses': total_responses,
                    'satisfaction_distribution': [
                        {'level': row[0], 'count': row[1]} for row in satisfaction_stats
                    ],
                    'design_ratings': [
                        {'rating': row[0], 'count': row[1]} for row in design_stats
                    ],
                    'functionality_ratings': [
                        {'rating': row[0], 'count': row[1]} for row in functionality_stats
                    ],
                    'content_ratings': [
                        {'rating': row[0], 'count': row[1]} for row in content_stats
                    ],
                    'navigation_ratings': [
                        {'rating': row[0], 'count': row[1]} for row in navigation_stats
                    ],
                    'feature_preferences': [
                        {'feature': row[0], 'count': row[1]} for row in feature_stats
                    ],
                    'recent_responses': [
                        {
                            'id': row[0],
                            'user_id': row[1],
                            'session_id': row[2],
                            'responses': json.loads(row[3]) if isinstance(row[3], str) else row[3],
                            'created_at': row[4].isoformat() if row[4] and hasattr(row[4], 'isoformat') else (row[4] if row[4] else None)
                        } for row in recent_responses
                    ]
                }
            }), 200
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'통계 조회 실패: {str(e)}'
        }), 500

# 개발자 인증 API (간단한 토큰 방식)
@app.route('/api/admin/auth', methods=['POST'])
def admin_auth():
    try:
        data = request.get_json()
        admin_token = data.get('token')
        
        # 간단한 개발자 토큰 (실제 환경에서는 더 안전한 인증 필요)
        if admin_token == 'gwangju_tour_admin_2024':
            return jsonify({
                'success': True,
                'message': '인증 성공'
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': '인증 실패'
            }), 401
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'인증 실패: {str(e)}'
        }), 500

# 8000 포트 프록시
@app.route('/api/themes', methods=['GET'])
@app.route('/api/spots', methods=['GET'])
@app.route('/api/routes', methods=['GET', 'POST'])
@app.route('/api/routes/<int:route_id>', methods=['GET', 'PUT', 'DELETE'])
@app.route('/api/routes/<int:route_id>/delete', methods=['POST'])
@app.route('/api/auth/<path:subpath>', methods=['POST'])
@app.route('/api/profile', methods=['GET'])
@app.route('/api/calculate-simple-distance', methods=['POST'])
@app.route('/api/routes/check-duplicate', methods=['POST'])
@app.route('/api/ai/recommendations/routes', methods=['GET'])
def proxy_to_8000(route_id=None, subpath=None):
    target_url = f'http://localhost:8000{request.full_path.rstrip("?")}'
    
    try:
        # 쿠키와 헤더 전달
        headers = dict(request.headers)
        cookies = dict(request.cookies)
        
        # Session 설정
        session = requests.Session()
        
        if request.method == 'GET':
            resp = session.get(target_url, params=request.args, headers=headers, cookies=cookies)
        elif request.method == 'POST':
            resp = session.post(target_url, json=request.get_json(), headers=headers, cookies=cookies)
        elif request.method == 'PUT':
            resp = session.put(target_url, json=request.get_json(), headers=headers, cookies=cookies)
        elif request.method == 'DELETE':
            resp = session.delete(target_url, headers=headers, cookies=cookies)
        else:
            resp = session.request(request.method, target_url, headers=headers, cookies=cookies)
        
        # 응답 쿠키를 클라이언트에게 전달
        flask_response = jsonify(resp.json()) if resp.content else jsonify({})
        flask_response.status_code = resp.status_code
        
        # Set-Cookie 헤더에서 쿠키 파싱 및 재설정
        set_cookie_header = resp.headers.get('Set-Cookie')
        if set_cookie_header:
            # Set-Cookie 헤더를 파싱
            # 예: "session_id=abc123; Path=/; HttpOnly; SameSite=Lax"
            cookie_parts = set_cookie_header.split(';')
            if cookie_parts:
                # 첫 번째 부분이 "name=value" 형식
                name_value = cookie_parts[0].strip().split('=', 1)
                if len(name_value) == 2:
                    cookie_name = name_value[0]
                    cookie_value = name_value[1]
                    
                    # 옵션 파싱
                    cookie_path = '/'
                    cookie_domain = None
                    secure = False
                    httponly = False
                    samesite = 'Lax'
                    
                    for part in cookie_parts[1:]:
                        part = part.strip().lower()
                        if part.startswith('path='):
                            cookie_path = part.split('=', 1)[1]
                        elif part.startswith('domain='):
                            domain_val = part.split('=', 1)[1]
                            if domain_val not in ['localhost', '127.0.0.1', '']:
                                cookie_domain = domain_val
                        elif part == 'secure':
                            secure = False  # localhost에서는 secure=False
                        elif part == 'httponly':
                            httponly = True
                        elif part.startswith('samesite='):
                            samesite = part.split('=', 1)[1].capitalize()
                    
                    flask_response.set_cookie(
                        key=cookie_name,
                        value=cookie_value,
                        domain=cookie_domain,
                        path=cookie_path,
                        secure=secure,
                        httponly=httponly,
                        samesite=samesite
                    )
        
        # resp.cookies도 백업으로 처리 (Set-Cookie 헤더에 없는 쿠키만)
        if set_cookie_header:
            set_cookie_names = [c.split('=')[0].strip() for c in set_cookie_header.split(';')]
        else:
            set_cookie_names = []
        
        for cookie in resp.cookies:
            if cookie.name not in set_cookie_names:
                cookie_domain = None
                if cookie.domain and cookie.domain not in ['localhost', '127.0.0.1', '']:
                    cookie_domain = cookie.domain
                
                flask_response.set_cookie(
                    key=cookie.name,
                    value=cookie.value,
                    domain=cookie_domain,
                    path=cookie.path or '/',
                    secure=False,
                    httponly=True,
                    samesite='Lax'
                )
        
        return flask_response
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 프론트엔드 정적 파일 서빙
@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static_files(path):
    if os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    print("🚀 통합 서버 시작 중...")
    print("📊 설문조사 API: POST /api/surveys")
    print("📈 관리자 통계 API: GET /api/admin/survey-stats")
    print("🔐 관리자 인증 API: POST /api/admin/auth")
    print("🗺️  관광지 데이터 API: /api/themes, /api/spots, /api/routes")
    print("🌐 서버 주소: http://0.0.0.0:5000")
    print("📁 프론트엔드: /")
    app.run(debug=True, host='0.0.0.0', port=5000)
