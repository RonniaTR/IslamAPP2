from backend.comparative_religions import get_all_topics, get_comparative_data, search_comparative


def test_comparative_fallbacks_return_structured_data():
    topics = get_all_topics()
    assert isinstance(topics, list)

    sample = get_comparative_data("faith")
    assert isinstance(sample, dict)
    assert "topic" in sample
    assert sample["topic"]


def test_comparative_search_returns_matches():
    results = search_comparative("faith")
    assert isinstance(results, list)
